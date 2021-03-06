package org.orcid.persistence.dao.impl;

import java.util.List;

import javax.persistence.NoResultException;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import org.orcid.persistence.dao.OrgDisambiguatedExternalIdentifierDao;
import org.orcid.persistence.jpa.entities.OrgDisambiguatedExternalIdentifierEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

public class OrgDisambiguatedExternalIdentifierDaoImpl extends GenericDaoImpl<OrgDisambiguatedExternalIdentifierEntity, Long>
        implements OrgDisambiguatedExternalIdentifierDao {
    
    private static final Logger LOGGER = LoggerFactory.getLogger(OrgDisambiguatedExternalIdentifierDaoImpl.class);

    public OrgDisambiguatedExternalIdentifierDaoImpl() {
        super(OrgDisambiguatedExternalIdentifierEntity.class);
    }

    @Override
    @Transactional
    public void remove(Long id) {
        Query query = entityManager.createNativeQuery("DELETE FROM org_disambiguated_external_identifier WHERE id = (:id)");        
        query.setParameter("id", id);
        query.executeUpdate();
    }
    
    @Override
    public OrgDisambiguatedExternalIdentifierEntity findByDetails(Long orgDisambiguatedId, String identifier, String identifierType) {
        try {
            TypedQuery<OrgDisambiguatedExternalIdentifierEntity> query = entityManager.createQuery("FROM OrgDisambiguatedExternalIdentifierEntity WHERE orgDisambiguated.id = :orgDisambiguatedId AND identifier = :identifier AND identifierType = :identifierType",
                    OrgDisambiguatedExternalIdentifierEntity.class);
            query.setParameter("orgDisambiguatedId", orgDisambiguatedId);
            query.setParameter("identifier", identifier);
            query.setParameter("identifierType", identifierType);
            return query.getSingleResult();
        } catch(NoResultException nre) {
            //Ignore no result exception and return null
        }
        return null;
    }
    
    @Override
    public List<OrgDisambiguatedExternalIdentifierEntity> findISNIsOfIncorrectLength(int batchSize) {
            TypedQuery<OrgDisambiguatedExternalIdentifierEntity> query = entityManager.createQuery("FROM OrgDisambiguatedExternalIdentifierEntity e WHERE LENGTH(e.identifier) != 16 AND e.identifierType = 'ISNI')",
                    OrgDisambiguatedExternalIdentifierEntity.class);
            query.setMaxResults(batchSize);
            return query.getResultList();
    }
    
    
    @Override
    public boolean exists(Long orgDisambiguatedId, String identifier, String identifierType) {
        try {
            TypedQuery<Long> query = entityManager.createQuery("SELECT count(identifier) FROM OrgDisambiguatedExternalIdentifierEntity WHERE orgDisambiguated.id = :orgDisambiguatedId AND identifier = :identifier AND identifierType = :identifierType",
                    Long.class);
            query.setParameter("orgDisambiguatedId", orgDisambiguatedId);
            query.setParameter("identifier", identifier);
            query.setParameter("identifierType", identifierType);
            Long result = query.getSingleResult();
            return (result != null && result > 0);
        } catch(NoResultException nre) {
            //Ignore no result exception and return null
        }
        return false;
    }
    
    @Override
    public List<OrgDisambiguatedExternalIdentifierEntity> findByIdentifierIdAndType(String identifier, String identifierType) {
        TypedQuery<OrgDisambiguatedExternalIdentifierEntity> query = entityManager.createQuery("FROM OrgDisambiguatedExternalIdentifierEntity WHERE identifier = :identifier AND identifierType = :identifierType",
                OrgDisambiguatedExternalIdentifierEntity.class);
        query.setParameter("identifier", identifier);
        query.setParameter("identifierType", identifierType);;
        LOGGER.info("OrgDisambiguatedExternalIdentifier by id and type: [" + query.toString() + "]");
        return query.getResultList();
    }

}
