package org.orcid.core.manager.v3.read_only.impl;

import org.apache.commons.lang3.StringUtils;
import org.orcid.core.adapter.v3.JpaJaxbWorkAdapter;
import org.orcid.core.contributors.roles.credit.CreditRole;
import org.orcid.core.exception.ExceedMaxNumberOfPutCodesException;
import org.orcid.core.exception.OrcidCoreExceptionMapper;
import org.orcid.core.exception.PutCodeFormatException;
import org.orcid.core.manager.WorkEntityCacheManager;
import org.orcid.core.manager.v3.GroupingSuggestionManager;
import org.orcid.core.manager.v3.read_only.WorkManagerReadOnly;
import org.orcid.core.togglz.Features;
import org.orcid.core.utils.v3.ContributorUtils;
import org.orcid.core.utils.v3.activities.ActivitiesGroup;
import org.orcid.core.utils.v3.activities.ActivitiesGroupGenerator;
import org.orcid.core.utils.v3.activities.WorkComparators;
import org.orcid.core.utils.v3.activities.WorkGroupAndGroupingSuggestionGenerator;
import org.orcid.jaxb.model.record.bulk.BulkElement;
import org.orcid.jaxb.model.v3.release.common.Contributor;
import org.orcid.jaxb.model.v3.release.common.ContributorAttributes;
import org.orcid.jaxb.model.v3.release.record.*;
import org.orcid.jaxb.model.v3.release.record.summary.WorkGroup;
import org.orcid.jaxb.model.v3.release.record.summary.WorkSummary;
import org.orcid.jaxb.model.v3.release.record.summary.Works;
import org.orcid.persistence.dao.WorkDao;
import org.orcid.persistence.jpa.entities.MinimizedExtendedWorkEntity;
import org.orcid.persistence.jpa.entities.MinimizedWorkEntity;
import org.orcid.persistence.jpa.entities.WorkEntity;
import org.orcid.persistence.jpa.entities.WorkLastModifiedEntity;
import org.orcid.pojo.ContributorsRolesAndSequences;
import org.orcid.pojo.WorkGroupExtended;
import org.orcid.pojo.WorkSummaryExtended;
import org.orcid.pojo.WorksExtended;
import org.orcid.pojo.ajaxForm.PojoUtil;
import org.orcid.pojo.grouping.WorkGroupingSuggestion;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class WorkManagerReadOnlyImpl extends ManagerReadOnlyBaseImpl implements WorkManagerReadOnly {
    
    public static final String BULK_PUT_CODES_DELIMITER = ",";

    @Resource(name = "jpaJaxbWorkAdapterV3")
    protected JpaJaxbWorkAdapter jpaJaxbWorkAdapter;

    @Resource
    protected OrcidCoreExceptionMapper orcidCoreExceptionMapper;

    protected WorkDao workDao;

    protected WorkEntityCacheManager workEntityCacheManager;

    private final Integer maxWorksToRead;
    
    @Resource
    private GroupingSuggestionManager groupingSuggestionsManager;

    @Resource(name = "contributorUtilsV3")
    private ContributorUtils contributorUtils;

    @Value("${org.orcid.core.work.contributors.ui.max:50}")
    private int maxContributorsForUI;
    
    public WorkManagerReadOnlyImpl(@Value("${org.orcid.core.works.bulk.read.max:100}") Integer bulkReadSize) {
        this.maxWorksToRead = (bulkReadSize == null) ? 100 : bulkReadSize;
    }
    
    public void setWorkDao(WorkDao workDao) {
        this.workDao = workDao;
    }

    public void setWorkEntityCacheManager(WorkEntityCacheManager workEntityCacheManager) {
        this.workEntityCacheManager = workEntityCacheManager;
    }

    /**
     * Find the works for a specific user
     * 
     * @param orcid
     *            the Id of the user
     * @return the list of works associated to the specific user
     */
    public List<Work> findWorks(String orcid) {
        List<MinimizedWorkEntity> minimizedWorks = workEntityCacheManager.retrieveMinimizedWorks(orcid, getLastModified(orcid));
        return jpaJaxbWorkAdapter.toMinimizedWork(minimizedWorks);
    }

    /**
     * Checks if there is any public work for a specific user
     * 
     * @param orcid
     *          the Id of the user
     * @return true if there is at least one public work for a specific user
     * */
    @Override
    public Boolean hasPublicWorks(String orcid) {
        if(PojoUtil.isEmpty(orcid)) {
            return false;
        }
        return workDao.hasPublicWorks(orcid);
    }
    
    
    
    /**
     * Find the public works for a specific user
     * 
     * @param orcid
     *            the Id of the user
     * @return the list of works associated to the specific user
     */
    public List<Work> findPublicWorks(String orcid) {
        List<MinimizedWorkEntity> minimizedWorks = workEntityCacheManager.retrievePublicMinimizedWorks(orcid, getLastModified(orcid));
        return jpaJaxbWorkAdapter.toMinimizedWork(minimizedWorks);
    }

    /**
     * Get the given Work from the database
     * 
     * @param orcid
     *            The work owner
     * @param workId
     *            The work id
     */
    @Override
    public Work getWork(String orcid, Long workId) {
        WorkEntity work = workDao.getWork(orcid, workId);
        return jpaJaxbWorkAdapter.toWork(work);
    }

    @Override
    public WorkSummary getWorkSummary(String orcid, Long workId) {
        WorkEntity work = workDao.getWork(orcid, workId);
        return jpaJaxbWorkAdapter.toWorkSummary(work);
    }

    /**
     * Get the list of works that belongs to a user
     * 
     * @param userOrcid
     * @param lastModified
     *            Last modified date used to check the cache
     * @return the list of works that belongs to this user
     */
    @Override
    public List<WorkSummary> getWorksSummaryList(String orcid) {
        List<MinimizedWorkEntity> works = workEntityCacheManager.retrieveMinimizedWorks(orcid, getLastModified(orcid));
        return jpaJaxbWorkAdapter.toWorkSummaryFromMinimized(works);
    }

    /**
     * Get the list of works that belongs to a user
     *
     * @param orcid
     * @return the list of works that belongs to this user
     */
    @Override
    public List<WorkSummaryExtended> getWorksSummaryExtendedList(String orcid) {
        List<MinimizedExtendedWorkEntity> works = workEntityCacheManager.retrieveMinimizedExtendedWorks(orcid, getLastModified(orcid));
        List<WorkSummaryExtended> wseList = jpaJaxbWorkAdapter.toWorkSummaryExtendedFromMinimized(works);
        // Filter the contributors list
        for (WorkSummaryExtended wse : wseList) {
            if (wse.getContributors() != null) {
                contributorUtils.filterContributorPrivateData(wse);
                List<ContributorsRolesAndSequences> contributorsGroupedByOrcid = getContributorsGroupedByOrcid(wse.getContributors().getContributor());
                if (contributorsGroupedByOrcid.size() > maxContributorsForUI) {
                    wse.setContributorsGroupedByOrcid(contributorsGroupedByOrcid.subList(0, maxContributorsForUI));
                } else {
                    wse.setContributorsGroupedByOrcid(contributorsGroupedByOrcid);
                }
                wse.setNumberOfContributorsGroupedByOrcid(contributorsGroupedByOrcid.size());
            }
        }
        return wseList;
    }

    private List<ContributorsRolesAndSequences> getContributorsGroupedByOrcid(List<Contributor> contributors) {
        List<ContributorsRolesAndSequences> contributorsRolesAndSequencesList = new ArrayList<>();
        contributors.forEach(contributor -> {
        	if (contributor.getContributorOrcid() != null) {
                String orcid = contributor.getContributorOrcid().getPath();
                if (!StringUtils.isBlank(orcid)) {
                    if (contributorsRolesAndSequencesList.size() > 0) {
                        List<ContributorsRolesAndSequences> c = contributorsRolesAndSequencesList
                            .stream()
                            .filter(contr -> contr.getContributorOrcid() != null && contr.getContributorOrcid().getPath() != null && orcid.equals(contr.getContributorOrcid().getPath()))                                                                        
                            .collect(Collectors.toList());
                        if (c.size() > 0) {
                            ContributorsRolesAndSequences contributorsRolesAndSequences = c.get(0);
                            ContributorAttributes ca = new ContributorAttributes();
                            if (contributor.getContributorAttributes() != null) {
                            	if(contributor.getContributorAttributes().getContributorRole() != null) { 
                            		ca.setContributorRole(getCreditRole(contributor.getContributorAttributes().getContributorRole()));
                            	}
                                if(contributor.getContributorAttributes().getContributorSequence() != null) {
                                	ca.setContributorSequence(contributor.getContributorAttributes().getContributorSequence());
                                }
                            }                            
                            List<ContributorAttributes> rolesAndSequencesList = contributorsRolesAndSequences.getRolesAndSequences();
                            rolesAndSequencesList.add(ca);
                            contributorsRolesAndSequences.setRolesAndSequences(rolesAndSequencesList);
                        } else {
                            contributorsRolesAndSequencesList.add(addContributor(contributor));
                        }
                    } else {
                        contributorsRolesAndSequencesList.add(addContributor(contributor));
                    }
                } else {
                	contributorsRolesAndSequencesList.add(addContributor(contributor));
                }
            } else {
                contributorsRolesAndSequencesList.add(addContributor(contributor));
            }
        });
        return contributorsRolesAndSequencesList;
    }

    private ContributorsRolesAndSequences addContributor(Contributor contributor) {
    	ContributorsRolesAndSequences crs = new ContributorsRolesAndSequences();
    	if(contributor == null) {
    		return crs;
    	}
        if (contributor.getContributorOrcid() != null) {
            crs.setContributorOrcid(contributor.getContributorOrcid());
        }
        if (contributor.getCreditName() != null) {
            crs.setCreditName(contributor.getCreditName());
        }
        if (contributor.getContributorAttributes() != null) {
            ContributorAttributes ca = new ContributorAttributes();
            if (contributor.getContributorAttributes().getContributorRole() != null) {
                ca.setContributorRole(getCreditRole(contributor.getContributorAttributes().getContributorRole()));
            }
            if (contributor.getContributorAttributes().getContributorSequence() != null) {
                ca.setContributorSequence(contributor.getContributorAttributes().getContributorSequence());
            }
            List<ContributorAttributes> rolesAndSequences = new ArrayList<>();
            rolesAndSequences.add(ca);
            crs.setRolesAndSequences(rolesAndSequences);
        }
        
        return crs;
    }

    private String getCreditRole(String contributorRole) {
        try {
            CreditRole cr = CreditRole.fromValue(contributorRole);
            return cr.getUiValue();
        } catch(IllegalArgumentException e) {
            return contributorRole;
        }
    }

    /**
     * Get the list of works specified by the list of put codes
     * 
     * @param userOrcid
     * @param lastModified
     *            Last modified date used to check the cache
     * @return the list of works that belongs to this user
     */
    @Override
    public List<WorkSummary> getWorksSummaryList(String orcid, List<Long> putCodes) {
        List<MinimizedWorkEntity> works = workEntityCacheManager.retrieveMinimizedWorks(orcid, putCodes, getLastModified(orcid));
        return jpaJaxbWorkAdapter.toWorkSummaryFromMinimized(works);
    }
    
    /**
     * Generate a grouped list of works with the given list of works and generates grouping suggestions
     * 
     * @param works
     *            The list of works to group
     * @return Works element with the WorkSummary elements grouped
     */
    @Override
    public Works groupWorksAndGenerateGroupingSuggestions(List<WorkSummary> summaries, String orcid) {
        WorkGroupAndGroupingSuggestionGenerator groupGenerator = new WorkGroupAndGroupingSuggestionGenerator();
        for (WorkSummary work : summaries) {
            groupGenerator.group(work);
        }
        Works works = processGroupedWorks(groupGenerator.getGroups());
        
        if (Features.GROUPING_SUGGESTIONS.isActive()) {
            List<WorkGroupingSuggestion> suggestions = groupGenerator.getGroupingSuggestions(orcid);
            groupingSuggestionsManager.cacheGroupingSuggestions(orcid, suggestions);
        }
        return works;
    }

    @Override
    public WorksExtended groupWorksExtendedAndGenerateGroupingSuggestions(List<WorkSummaryExtended> summaries, String orcid) {
        WorkGroupAndGroupingSuggestionGenerator groupGenerator = new WorkGroupAndGroupingSuggestionGenerator();
        for (WorkSummaryExtended work : summaries) {
            groupGenerator.group(work);
        }
        WorksExtended works = processGroupedWorksExtended(groupGenerator.getGroups());

        if (Features.GROUPING_SUGGESTIONS.isActive()) {
            List<WorkGroupingSuggestion> suggestions = groupGenerator.getGroupingSuggestions(orcid);
            groupingSuggestionsManager.cacheGroupingSuggestions(orcid, suggestions);
        }
        return works;
    }

    /**
     * Generate a grouped list of works with the given list of works
     * 
     * @param works
     *            The list of works to group
     * @param justPublic
     *            Specify if we want to group only the public elements in the
     *            given list
     * @return Works element with the WorkSummary elements grouped
     */
    @Override
    public Works groupWorks(List<WorkSummary> works, boolean justPublic) {
        ActivitiesGroupGenerator groupGenerator = new ActivitiesGroupGenerator();
        for (WorkSummary work : works) {
            if (justPublic && !work.getVisibility().equals(org.orcid.jaxb.model.v3.release.common.Visibility.PUBLIC)) {
                // If it is just public and the work is not public, just ignore
                // it
            } else {
                groupGenerator.group(work);
            }
        }
        return processGroupedWorks(groupGenerator.getGroups());
    }

    @Override
    public WorkBulk findWorkBulk(String orcid, String putCodesAsString) {
        List<BulkElement> works = new ArrayList<>();        
        List<Long> putCodes = Arrays.stream(getPutCodeArray(putCodesAsString)).map(s -> Long.parseLong(s)).collect(Collectors.toList());                        
        List<WorkEntity> entities = new ArrayList<>();
        
        if (Features.READ_BULK_WORKS_DIRECTLY_FROM_DB.isActive()) {
            entities = workDao.getWorkEntities(orcid, putCodes);            
        } else {
            entities = workEntityCacheManager.retrieveFullWorks(orcid, putCodes);
        }
        
        for(WorkEntity entity : entities) {
            works.add(jpaJaxbWorkAdapter.toWork(entity));
            putCodes.remove(entity.getId());
        }
        
        // Put codes still in this list doesn't exists on the database
        for(Long invalidPutCode : putCodes) {
            works.add(orcidCoreExceptionMapper.getV3OrcidError(new PutCodeFormatException("'" + invalidPutCode + "' is not a valid put code")));
        }
        
        WorkBulk bulk = new WorkBulk();
        bulk.setBulk(works);
        return bulk;
    }
    
    @Override
    public Works getWorksAsGroups(String orcid) {
        return groupWorksAndGenerateGroupingSuggestions(getWorksSummaryList(orcid), orcid);
    }

    @Override
    public WorksExtended getWorksExtendedAsGroups(String orcid) {
        return groupWorksExtendedAndGenerateGroupingSuggestions(getWorksSummaryExtendedList(orcid), orcid);
    }

    private String[] getPutCodeArray(String putCodesAsString) {
        String[] putCodeArray = putCodesAsString.split(BULK_PUT_CODES_DELIMITER);
        if (putCodeArray.length > maxWorksToRead) {
            throw new ExceedMaxNumberOfPutCodesException(maxWorksToRead);
        }
        return putCodeArray;
    }

    @Override
    public List<Work> findWorks(String orcid, List<WorkLastModifiedEntity> elements) {
        List<Work> result = new ArrayList<Work>();
        for(WorkLastModifiedEntity w : elements) {
            WorkEntity entity = workEntityCacheManager.retrieveFullWork(orcid, w.getId(), w.getLastModified().getTime());
            result.add(jpaJaxbWorkAdapter.toWork(entity));
        }
        return result;
    }

    @Override
    public ExternalIDs getAllExternalIDs(String orcid) {
        List<WorkSummary> summaries = getWorksSummaryList(orcid);
        ExternalIDs ids = new ExternalIDs();
        for (WorkSummary s:summaries){
            for (ExternalID id: s.getExternalIdentifiers().getExternalIdentifier()){
                if (!ids.getExternalIdentifier().contains(id)){
                    ids.getExternalIdentifier().add(id);
                }
            }
        }
        return ids;
    }
    
    private Works processGroupedWorks(List<ActivitiesGroup> groups) {
        Works result = new Works();
        for (ActivitiesGroup group : groups) {
            Set<GroupAble> externalIdentifiers = group.getGroupKeys();
            Set<GroupableActivity> activities = group.getActivities();
            WorkGroup workGroup = new WorkGroup();
            // Fill the work groups with the external identifiers
            if(externalIdentifiers == null || externalIdentifiers.isEmpty()) {
                // Initialize the ids as an empty list
                workGroup.getIdentifiers().getExternalIdentifier();
            } else {
                for (GroupAble extId : externalIdentifiers) {
                    ExternalID workExtId = (ExternalID) extId;
                    workGroup.getIdentifiers().getExternalIdentifier().add(workExtId.clone());
                }
            }
            
            // Fill the work group with the list of activities
            for (GroupableActivity activity : activities) {
                WorkSummary workSummary = (WorkSummary) activity;
                workGroup.getWorkSummary().add(workSummary);
            }

            // Sort the works
            workGroup.getWorkSummary().sort(WorkComparators.WORKS_WITHIN_GROUP);
            result.getWorkGroup().add(workGroup);
        }
        // Sort the groups!
        result.getWorkGroup().sort(WorkComparators.GROUP);
        return result;
    }

    private WorksExtended processGroupedWorksExtended(List<ActivitiesGroup> groups) {
        WorksExtended result = new WorksExtended();
        for (ActivitiesGroup group : groups) {
            Set<GroupAble> externalIdentifiers = group.getGroupKeys();
            Set<GroupableActivity> activities = group.getActivities();
            WorkGroupExtended workGroup = new WorkGroupExtended();
            // Fill the work groups with the external identifiers
            if(externalIdentifiers == null || externalIdentifiers.isEmpty()) {
                // Initialize the ids as an empty list
                workGroup.getIdentifiers().getExternalIdentifier();
            } else {
                for (GroupAble extId : externalIdentifiers) {
                    ExternalID workExtId = (ExternalID) extId;
                    workGroup.getIdentifiers().getExternalIdentifier().add(workExtId.clone());
                }
            }

            // Fill the work group with the list of activities
            for (GroupableActivity activity : activities) {
                WorkSummaryExtended workSummary = (WorkSummaryExtended) activity;
                workGroup.getWorkSummary().add(workSummary);
            }

            // Sort the works
            workGroup.getWorkSummary().sort(WorkComparators.WORKS_WITHIN_GROUP);
            result.getWorkGroup().add(workGroup);
        }
        // Sort the groups!
        result.getWorkGroup().sort(WorkComparators.GROUP_WORK_SUMMARY_EXTENDED);
        return result;
    }

}
