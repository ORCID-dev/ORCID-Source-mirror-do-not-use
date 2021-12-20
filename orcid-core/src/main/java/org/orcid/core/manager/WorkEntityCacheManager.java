package org.orcid.core.manager;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.ehcache.Cache;
import org.orcid.core.manager.impl.WorkCacheKey;
import org.orcid.persistence.jpa.entities.MinimizedExtendedWorkEntity;
import org.orcid.persistence.jpa.entities.MinimizedWorkEntity;
import org.orcid.persistence.jpa.entities.WorkBaseEntity;
import org.orcid.persistence.jpa.entities.WorkEntity;
import org.orcid.persistence.jpa.entities.WorkLastModifiedEntity;

/**
 * 
 * @author Will Simpson
 *
 */
public interface WorkEntityCacheManager {

    List<WorkLastModifiedEntity> retrieveWorkLastModifiedList(String orcid, long profileLastModified);

    List<WorkLastModifiedEntity> retrievePublicWorkLastModifiedList(String orcid, long profileLastModified);

    MinimizedWorkEntity retrieveMinimizedWork(long workId, long workLastModified);

    <T extends WorkBaseEntity> List<T> retrieveWorkList(String orcid, Map<Long, Date> workIdsWithLastModified, Cache<WorkCacheKey, WorkBaseEntity> workCache,
            Function<List<Long>, List<T>> workRetriever);

    List<MinimizedExtendedWorkEntity> retrieveMinimizedWorks(String orcid, long profileLastModified);

    List<MinimizedExtendedWorkEntity> retrieveMinimizedExtendedWorks(String orcid, long profileLastModified);

    List<MinimizedExtendedWorkEntity> retrievePublicMinimizedWorks(String orcid, long profileLastModified);
    
    List<MinimizedExtendedWorkEntity> retrieveMinimizedWorks(String orcid, List<Long> ids, long profileLastModified);

    WorkEntity retrieveFullWork(String orcid, long workId, long workLastModified);
    
    @Deprecated
    List<WorkEntity> retrieveFullWorks(String orcid, long profileLastModified);
    
    List<WorkEntity> retrieveFullWorks(String orcid, List<Long> workIds);
}
