package org.orcid.core.adapter.v3;

import java.util.Collection;
import java.util.List;

import org.orcid.jaxb.model.v3.release.record.Work;
import org.orcid.jaxb.model.v3.release.record.summary.WorkSummary;
import org.orcid.persistence.jpa.entities.MinimizedExtendedWorkEntity;
import org.orcid.persistence.jpa.entities.MinimizedWorkEntity;
import org.orcid.persistence.jpa.entities.WorkEntity;
import org.orcid.pojo.WorkSummaryExtended;

/**
 * 
 * @author Will Simpson
 *
 */
public interface JpaJaxbWorkAdapter {

    WorkEntity toWorkEntity(Work work);

    Work toWork(WorkEntity workEntity);
    
    WorkSummary toWorkSummary(WorkEntity workEntity);

    List<Work> toWork(Collection<WorkEntity> workEntities);

    List<Work> toMinimizedWork(Collection<MinimizedExtendedWorkEntity> minimizedEntities);
    
    List<WorkSummary> toWorkSummary(Collection<WorkEntity> workEntities);
    
    List<WorkSummary> toWorkSummaryFromMinimized(Collection<MinimizedExtendedWorkEntity> workEntities);

    List<WorkSummaryExtended> toWorkSummaryExtendedFromMinimized(Collection<MinimizedExtendedWorkEntity> workEntities);

    WorkEntity toWorkEntity(Work work, WorkEntity existing);

}
