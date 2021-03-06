package org.orcid.core.manager.impl;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import javax.annotation.Resource;

import org.apache.http.HttpStatus;
import org.apache.http.HttpVersion;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.message.BasicHttpResponse;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.mockito.ArgumentMatcher;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.orcid.core.BaseTest;
import org.orcid.core.manager.WebhookManager;
import org.orcid.persistence.dao.WebhookDao;
import org.orcid.persistence.jpa.entities.ClientDetailsEntity;
import org.orcid.persistence.jpa.entities.ProfileEntity;
import org.orcid.persistence.jpa.entities.WebhookEntity;
import org.orcid.pojo.ajaxForm.PojoUtil;

public class WebhookManagerImplTest extends BaseTest {

    @Resource
    private WebhookManager webhookManager;

    @Mock
    private HttpClient mockHttpClient;

    @Mock
    private WebhookDao mockWebhookDao;
    
    @Resource
    private WebhookDao webhookDao;
    
    private ClientDetailsEntity clientDetails;

    private ProfileEntity testProfile;
    
    private String orcid;

    @Before
    public void init() throws Exception {
        assertNotNull(webhookManager);

        WebhookManagerImpl webhookManagerImpl = getTargetObject(webhookManager, WebhookManagerImpl.class);
        webhookManagerImpl.setHttpClient(mockHttpClient);
        when(mockHttpClient.execute(ArgumentMatchers.<HttpUriRequest> any())).thenReturn(new BasicHttpResponse(HttpVersion.HTTP_1_1, HttpStatus.SC_NOT_FOUND, "Not found"));
        when(mockHttpClient.execute(ArgumentMatchers.<HttpPost> argThat(new ArgumentMatcher<HttpPost>() {
            public boolean matches(HttpPost argument) {
                if (argument == null || !(argument instanceof HttpPost)) {
                    return false;
                }
                HttpPost httpPost = (HttpPost) argument;
                return httpPost.getURI().getHost().equals("qa-1.orcid.org");
            }
        }))).thenReturn(new BasicHttpResponse(HttpVersion.HTTP_1_1, HttpStatus.SC_OK, "OK"));
        webhookManagerImpl.setWebhookDao(mockWebhookDao);

        ProfileEntity profile = new ProfileEntity();
        profile.setId("0000-0000-0000-0001");
        clientDetails = new ClientDetailsEntity();
        clientDetails.setGroupProfileId(profile.getId());
        clientDetails.setId("123456789");

        assertFalse(PojoUtil.isEmpty(clientDetails.getGroupProfileId()));
        assertNotNull(clientDetails.getId());
        orcid = "4444-4444-4444-4444";
        testProfile = new ProfileEntity(orcid);
    }   
        
    @After
    public void after() throws Exception {
        WebhookManagerImpl webhookManagerImpl = getTargetObject(webhookManager, WebhookManagerImpl.class);
        webhookManagerImpl.setWebhookDao(webhookDao);
    }
    
    @Test
    public void testValidUriOnWebhook() {
        WebhookEntity webhook = new WebhookEntity();
        webhook.setClientDetailsId(clientDetails.getId());
        webhook.setUri("http://qa-1.orcid.org");
        webhook.setProfile(orcid);
        webhookManager.processWebhook(webhook);
        assertEquals(webhook.getFailedAttemptCount(), 0);
        verify(mockWebhookDao, times(1)).merge(webhook);
    }

    @Test
    public void testUnexsistingUriOnWebhook() {
        WebhookEntity webhook = new WebhookEntity();
        webhook.setClientDetailsId(clientDetails.getId());
        webhook.setUri("http://unexisting.orcid.com");
        webhook.setProfile(orcid);
        webhookManager.processWebhook(webhook);
        assertEquals(webhook.getFailedAttemptCount(), 1);
        for (int i = 0; i < 3; i++) {
            webhookManager.processWebhook(webhook);
        }
        assertEquals(webhook.getFailedAttemptCount(), 4);
        verify(mockWebhookDao, times(4)).merge(webhook);
    }

    @Test
    public void testInvalidUriOnWebhook() {
        WebhookEntity webhook = new WebhookEntity();
        webhook.setClientDetailsId(clientDetails.getId());
        webhook.setUri("http://123.qa-1.orcid.org");
        webhook.setProfile(orcid);
        webhookManager.processWebhook(webhook);
        assertEquals(webhook.getFailedAttemptCount(), 1);
        for (int i = 0; i < 3; i++) {
            webhookManager.processWebhook(webhook);
        }
        assertEquals(webhook.getFailedAttemptCount(), 4);
        verify(mockWebhookDao, times(4)).merge(webhook);
    }

    @Test
    public void testFailAttemptCounterReset() {
        WebhookEntity webhook = new WebhookEntity();
        webhook.setClientDetailsId(clientDetails.getId());
        webhook.setUri("http://123.qa-1.orcid.org");
        webhook.setProfile(orcid);
        webhookManager.processWebhook(webhook);
        assertEquals(webhook.getFailedAttemptCount(), 1);

        webhook.setUri("http://unexisting.orcid.com");
        webhookManager.processWebhook(webhook);
        assertEquals(webhook.getFailedAttemptCount(), 2);

        webhook.setUri("http://qa-1.orcid.org");
        webhookManager.processWebhook(webhook);
        assertEquals(webhook.getFailedAttemptCount(), 0);
        verify(mockWebhookDao, times(3)).merge(webhook);
    }

}
