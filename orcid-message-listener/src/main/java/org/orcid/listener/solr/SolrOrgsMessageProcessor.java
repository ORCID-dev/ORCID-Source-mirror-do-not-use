package org.orcid.listener.solr;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

import javax.annotation.Resource;
import javax.xml.bind.JAXBException;

import org.apache.commons.lang3.StringUtils;
import org.orcid.utils.solr.entities.OrgDisambiguatedSolrDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.jersey.api.client.Client;
import com.sun.jersey.api.client.ClientResponse;
import com.sun.jersey.api.client.WebResource;

@Component
public class SolrOrgsMessageProcessor implements Consumer<OrgDisambiguatedSolrDocument> {

    Logger LOG = LoggerFactory.getLogger(SolrOrgsMessageProcessor.class);

    private static final Integer MAX_RETRY_COUNT = 3;

    @Value("${org.orcid.persistence.messaging.solr_org_indexing.enabled:true}")
    private boolean isSolrOrgsIndexingEnabled;

    @Resource
    private SolrIndexUpdater solrUpdater;

    @Value("${org.orcid.core.slack.webhookUrl:}")
    private String webhookUrl;

    static ObjectMapper mapper = new ObjectMapper();

    private Client client = Client.create();

    @Autowired
    public SolrOrgsMessageProcessor() throws JAXBException {

    }

    @Override
    public void accept(OrgDisambiguatedSolrDocument t) {
        if(isSolrOrgsIndexingEnabled) {
            process(t, 0);
        }
    }

    private void process(OrgDisambiguatedSolrDocument t, Integer retryCount) {
        try {
            if("DEPRECATED".equals(t.getOrgDisambiguatedStatus()) || "OBSOLETE".equals(t.getOrgDisambiguatedStatus()) || "PART_OF_GROUP".equals(t.getOrgDisambiguatedStatus()) ) {
                solrUpdater.delete(String.valueOf(t.getOrgDisambiguatedId()));
            } else {
                solrUpdater.persist(t);                
            }                        
        } catch (Exception e) {
            LOG.error("Unable to persists org " + t.getOrgDisambiguatedId() + " in SOLR");
            LOG.error(e.getMessage(), e);
            if (retryCount > MAX_RETRY_COUNT) {
                sendSystemAlert("SOLR Index error: Unable to persist org with disambiguated org id = " + t.getOrgDisambiguatedId() + " and name " + t.getOrgDisambiguatedName() + " in SOLR");
            } else {
                process(t, retryCount + 1);
            }
        }
    }

    private void sendSystemAlert(String message) {
        if (StringUtils.isNotBlank(webhookUrl)) {
            Map<String, String> bodyMap = new HashMap<>();
            bodyMap.put("text", message);
            String bodyJson = null;
            try {
                bodyJson = mapper.writeValueAsString(bodyMap);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }

            WebResource resource = client.resource(webhookUrl);
            ClientResponse response = resource.entity(bodyJson).post(ClientResponse.class);
            int status = response.getStatus();
            if (status != 200) {
                LOG.warn("Unable to send message to Slack, status={}, error={}, message={}", new Object[] { status, response.getEntity(String.class), message });
            }
        }
    }
}
