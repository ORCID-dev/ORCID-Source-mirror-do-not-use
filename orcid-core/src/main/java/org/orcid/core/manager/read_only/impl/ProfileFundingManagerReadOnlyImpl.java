package org.orcid.core.manager.read_only.impl;

import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.annotation.Resource;

import org.orcid.core.adapter.JpaJaxbFundingAdapter;
import org.orcid.core.manager.read_only.ProfileFundingManagerReadOnly;
import org.orcid.core.utils.activities.ActivitiesGroup;
import org.orcid.core.utils.activities.ActivitiesGroupGenerator;
import org.orcid.core.utils.activities.GroupableActivityComparator;
import org.orcid.jaxb.model.record.summary_v2.FundingGroup;
import org.orcid.jaxb.model.record.summary_v2.FundingSummary;
import org.orcid.jaxb.model.record.summary_v2.Fundings;
import org.orcid.jaxb.model.record_v2.ExternalID;
import org.orcid.jaxb.model.record_v2.Funding;
import org.orcid.jaxb.model.record_v2.GroupAble;
import org.orcid.jaxb.model.record_v2.GroupableActivity;
import org.orcid.persistence.dao.ProfileFundingDao;
import org.orcid.persistence.jpa.entities.ProfileFundingEntity;

public class ProfileFundingManagerReadOnlyImpl extends ManagerReadOnlyBaseImpl implements ProfileFundingManagerReadOnly {
    
    @Resource
    protected JpaJaxbFundingAdapter jpaJaxbFundingAdapter;
        
    protected ProfileFundingDao profileFundingDao;      
    
    public void setProfileFundingDao(ProfileFundingDao profileFundingDao) {
        this.profileFundingDao = profileFundingDao;
    }

    /**
     * Get the funding associated with the given profileFunding id
     * 
     * @param profileFundingId
     *            The id of the ProfileFundingEntity object
     * 
     * @return the ProfileFundingEntity object
     * */
    @Deprecated
    public ProfileFundingEntity getProfileFundingEntity(Long profileFundingId) {
        return profileFundingDao.getProfileFundingEntity(profileFundingId);
    }       
    
    /**
     * Get a funding based on the orcid and funding id
     * @param orcid
     *          The funding owner
     * @param fundingId
     *          The funding id
     * @return the Funding          
     * */
    @Override
    public Funding getFunding(String orcid, Long fundingId) {
        ProfileFundingEntity profileFundingEntity = profileFundingDao.getProfileFunding(orcid, fundingId); 
        return jpaJaxbFundingAdapter.toFunding(profileFundingEntity);
    }
    
    /**
     * Get a funding summary based on the orcid and funding id
     * @param orcid
     *          The funding owner
     * @param fundingId
     *          The funding id
     * @return the FundingSummary          
     * */
    @Override
    public FundingSummary getSummary(String orcid, Long fundingId) {
        ProfileFundingEntity profileFundingEntity = profileFundingDao.getProfileFunding(orcid, fundingId);
        return jpaJaxbFundingAdapter.toFundingSummary(profileFundingEntity);
    }
        
    /**
     * Get the list of fundings summaries that belongs to a user
     * 
     * @param userOrcid
     * @param lastModified
     *          Last modified date used to check the cache
     * @return the list of fundings that belongs to this user
     * */
    @Override
    public List<FundingSummary> getFundingSummaryList(String userOrcid) {
        List<ProfileFundingEntity> fundingEntities = profileFundingDao.getByUser(userOrcid, getLastModified(userOrcid));
        return jpaJaxbFundingAdapter.toFundingSummary(fundingEntities);
    }
    
    /**
     * Get the list of fundings that belongs to a user
     * 
     * @param userOrcid
     * @param lastModified
     *          Last modified date used to check the cache
     * @return the list of fundings that belongs to this user
     * */
    @Override
    public List<Funding> getFundingList(String userOrcid) {
        List<ProfileFundingEntity> fundingEntities = profileFundingDao.getByUser(userOrcid, getLastModified(userOrcid));
        return jpaJaxbFundingAdapter.toFunding(fundingEntities);
    }
        
    /**
     * Generate a grouped list of funding with the given list of funding
     * 
     * @param fundings
     *          The list of fundings to group
     * @param justPublic
     *          Specify if we want to group only the public elements in the given list
     * @return Fundings element with the FundingSummary elements grouped                  
     * */
    @Override
    public Fundings groupFundings(List<FundingSummary> fundings, boolean justPublic) {
        ActivitiesGroupGenerator groupGenerator = new ActivitiesGroupGenerator();
        Fundings result = new Fundings();
        for (FundingSummary funding : fundings) {
            if (justPublic && !funding.getVisibility().equals(org.orcid.jaxb.model.common_v2.Visibility.PUBLIC)) {
                // If it is just public and the funding is not public, just
                // ignore it
            } else {
                groupGenerator.group(funding);
            }
        }

        List<ActivitiesGroup> groups = groupGenerator.getGroups();

        for (ActivitiesGroup group : groups) {
            Set<GroupAble> externalIdentifiers = group.getGroupKeys();
            Set<GroupableActivity> activities = group.getActivities();
            FundingGroup fundingGroup = new FundingGroup();

            // Fill the funding groups with the external identifiers
            if(externalIdentifiers == null || externalIdentifiers.isEmpty()) {
                // Initialize the ids as an empty list
                fundingGroup.getIdentifiers().getExternalIdentifier();
            } else {
                for (GroupAble extId : externalIdentifiers) {
                    ExternalID fundingExtId = (ExternalID) extId;
                    fundingGroup.getIdentifiers().getExternalIdentifier().add(fundingExtId.clone());
                }
            }            

            // Fill the funding group with the list of activities
            for (GroupableActivity activity : activities) {
                FundingSummary fundingSummary = (FundingSummary) activity;
                fundingGroup.getFundingSummary().add(fundingSummary);
            }

            // Sort the fundings
            Collections.sort(fundingGroup.getFundingSummary(), new GroupableActivityComparator());

            result.getFundingGroup().add(fundingGroup);
        }       
        return result;
    }
}
