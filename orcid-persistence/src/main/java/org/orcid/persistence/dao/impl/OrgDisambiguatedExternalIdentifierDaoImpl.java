package org.orcid.persistence.dao.impl;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;

import org.orcid.persistence.dao.OrgDisambiguatedExternalIdentifierDao;
import org.orcid.persistence.jpa.entities.OrgDisambiguatedExternalIdentifierEntity;

public class OrgDisambiguatedExternalIdentifierDaoImpl extends GenericDaoImpl<OrgDisambiguatedExternalIdentifierEntity, Long>
        implements OrgDisambiguatedExternalIdentifierDao {

    public OrgDisambiguatedExternalIdentifierDaoImpl() {
        super(OrgDisambiguatedExternalIdentifierEntity.class);
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

}
