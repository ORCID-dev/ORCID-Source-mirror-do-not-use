package org.orcid.persistence.dao.impl;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;

import javax.persistence.TypedQuery;

import org.orcid.persistence.dao.WebhookDao;
import org.orcid.persistence.jpa.entities.WebhookEntity;
import org.orcid.persistence.jpa.entities.keys.WebhookEntityPk;
import org.springframework.beans.factory.annotation.Value;

/**
 * @author Will Simpson
 */
public class WebhookDaoImpl extends GenericDaoImpl<WebhookEntity, WebhookEntityPk> implements WebhookDao {

    @Value("${org.orcid.persistence.webhook.maxAttemptCount:25}")
    private int maxAttemptCount;
    
    public WebhookDaoImpl() {
        super(WebhookEntity.class);
    }

    @Override
    public List<WebhookEntity> findWebhooksReadyToProcess(Date profileModifiedBefore, int retryDelayMinutes, int maxResults) {
        TypedQuery<WebhookEntity> query = entityManager.createNamedQuery(WebhookEntity.FIND_WEBHOOKS_READY_TO_PROCESS, WebhookEntity.class);
        query.setParameter("retryDelayMinutes", retryDelayMinutes);
        query.setParameter("maxAttemptCount", maxAttemptCount);
        return query.getResultList();
    }

    @Override
    public long countWebhooksReadyToProcess(Date profileModifiedBefore, int retryDelayMinutes) {
        TypedQuery<BigInteger> query = entityManager.createNamedQuery(WebhookEntity.COUNT_WEBHOOKS_READY_TO_PROCESS, BigInteger.class);
        query.setParameter("retryDelayMinutes", retryDelayMinutes);
        query.setParameter("maxAttemptCount", maxAttemptCount);
        return query.getSingleResult().longValue();
    }

}
