package org.orcid.core.contributors.works;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

import org.junit.Test;
import org.orcid.core.contributors.roles.works.WorkContributorRoleConverter;

public class WorkContributorRoleConverterTest {

    @Test
    public void testGetDbValueFromAPIValue() {
        WorkContributorRoleConverter converter = new WorkContributorRoleConverter();
        
        // legacy
        assertEquals("AUTHOR", converter.toDBRole("author"));
        assertEquals("ASSIGNEE", converter.toDBRole("assignee"));
        assertEquals("EDITOR", converter.toDBRole("editor"));
        assertEquals("CHAIR_OR_TRANSLATOR", converter.toDBRole("chair-or-translator"));
        assertEquals("CO_INVESTIGATOR", converter.toDBRole("co-investigator"));
        assertEquals("CO_INVENTOR", converter.toDBRole("co-inventor"));
        assertEquals("GRADUATE_STUDENT", converter.toDBRole("graduate-student"));
        assertEquals("OTHER_INVENTOR", converter.toDBRole("other-inventor"));
        assertEquals("PRINCIPAL_INVESTIGATOR", converter.toDBRole("principal-investigator"));
        assertEquals("POSTDOCTORAL_RESEARCHER", converter.toDBRole("postdoctoral-researcher"));
        assertEquals("SUPPORT_STAFF", converter.toDBRole("support-staff"));

        // credit
        assertEquals("CONCEPTUALIZATION", converter.toDBRole("http://credit.niso.org/contributor-roles/conceptualization/"));
        assertEquals("DATA_CURATION", converter.toDBRole("http://credit.niso.org/contributor-roles/data-curation/"));
        assertEquals("EDITOR", converter.toDBRole("editor"));
        assertEquals("FORMAL_ANALYSIS", converter.toDBRole("http://credit.niso.org/contributor-roles/formal-analysis/"));
        assertEquals("FUNDING_ACQUISITION", converter.toDBRole("http://credit.niso.org/contributor-roles/funding-acquisition/"));
        assertEquals("INVESTIGATION", converter.toDBRole("http://credit.niso.org/contributor-roles/investigation/"));
        assertEquals("METHODOLOGY", converter.toDBRole("http://credit.niso.org/contributor-roles/methodology/"));
        assertEquals("PROJECT_ADMINISTRATION", converter.toDBRole("http://credit.niso.org/contributor-roles/project-administration/"));
        assertEquals("RESOURCES", converter.toDBRole("http://credit.niso.org/contributor-roles/resources/"));
        assertEquals("SOFTWARE", converter.toDBRole("http://credit.niso.org/contributor-roles/software/"));
        assertEquals("SUPERVISION", converter.toDBRole("http://credit.niso.org/contributor-roles/supervision/"));
        assertEquals("VALIDATION", converter.toDBRole("http://credit.niso.org/contributor-roles/validation/"));
        assertEquals("VISUALIZATION", converter.toDBRole("http://credit.niso.org/contributor-roles/visualization/"));
        assertEquals("WRITING_ORIGINAL_DRAFT", converter.toDBRole("http://credit.niso.org/contributor-roles/writing-original-draft/"));
        assertEquals("WRITING_REVIEW_EDITING", converter.toDBRole("http://credit.niso.org/contributor-roles/writing-review-editing/"));
    }

    @Test
    public void testToLegacyRoleValue() {
        WorkContributorRoleConverter converter = new WorkContributorRoleConverter();
        
        // legacy
        assertEquals("author", converter.toLegacyRoleValue("AUTHOR"));
        assertEquals("assignee", converter.toLegacyRoleValue("ASSIGNEE"));
        assertEquals("editor", converter.toLegacyRoleValue("EDITOR"));
        assertEquals("chair-or-translator", converter.toLegacyRoleValue("CHAIR_OR_TRANSLATOR"));
        assertEquals("co-investigator", converter.toLegacyRoleValue("CO_INVESTIGATOR"));
        assertEquals("co-inventor", converter.toLegacyRoleValue("CO_INVENTOR"));
        assertEquals("graduate-student", converter.toLegacyRoleValue("GRADUATE_STUDENT"));
        assertEquals("other-inventor", converter.toLegacyRoleValue("OTHER_INVENTOR"));
        assertEquals("principal-investigator", converter.toLegacyRoleValue("PRINCIPAL_INVESTIGATOR"));
        assertEquals("postdoctoral-researcher", converter.toLegacyRoleValue("POSTDOCTORAL_RESEARCHER"));
        assertEquals("support-staff", converter.toLegacyRoleValue("SUPPORT_STAFF"));

        // credit
        assertNull(converter.toLegacyRoleValue("CONCEPTUALIZATION"));
        assertNull(converter.toLegacyRoleValue("DATA_CURATION"));
        assertEquals("editor", converter.toLegacyRoleValue("EDITOR")); // special case, part of both sets of roles
        assertNull(converter.toLegacyRoleValue("FORMAL_ANALYSIS"));
        assertNull(converter.toLegacyRoleValue("FUNDING_ACQUISITION"));
        assertEquals("co-investigator", converter.toLegacyRoleValue("INVESTIGATION"));
        assertNull(converter.toLegacyRoleValue("METHODOLOGY"));
        assertNull(converter.toLegacyRoleValue("PROJECT_ADMINISTRATION"));
        assertNull(converter.toLegacyRoleValue("RESOURCES"));
        assertNull(converter.toLegacyRoleValue("SOFTWARE"));
        assertEquals("principal-investigator", converter.toLegacyRoleValue("SUPERVISION"));
        assertNull(converter.toLegacyRoleValue("VALIDATION"));
        assertNull(converter.toLegacyRoleValue("VISUALIZATION"));
        assertEquals("author", converter.toLegacyRoleValue("WRITING_ORIGINAL_DRAFT"));
        assertEquals("editor", converter.toLegacyRoleValue("WRITING_REVIEW_EDITING"));
    }
    
    @Test
    public void testToLegacyRoleName() {
        WorkContributorRoleConverter converter = new WorkContributorRoleConverter();
        
        // legacy
        assertEquals("AUTHOR", converter.toLegacyRoleName("AUTHOR"));
        assertEquals("ASSIGNEE", converter.toLegacyRoleName("ASSIGNEE"));
        assertEquals("EDITOR", converter.toLegacyRoleName("EDITOR"));
        assertEquals("CHAIR_OR_TRANSLATOR", converter.toLegacyRoleName("CHAIR_OR_TRANSLATOR"));
        assertEquals("CO_INVESTIGATOR", converter.toLegacyRoleName("CO_INVESTIGATOR"));
        assertEquals("CO_INVENTOR", converter.toLegacyRoleName("CO_INVENTOR"));
        assertEquals("GRADUATE_STUDENT", converter.toLegacyRoleName("GRADUATE_STUDENT"));
        assertEquals("OTHER_INVENTOR", converter.toLegacyRoleName("OTHER_INVENTOR"));
        assertEquals("PRINCIPAL_INVESTIGATOR", converter.toLegacyRoleName("PRINCIPAL_INVESTIGATOR"));
        assertEquals("POSTDOCTORAL_RESEARCHER", converter.toLegacyRoleName("POSTDOCTORAL_RESEARCHER"));
        assertEquals("SUPPORT_STAFF", converter.toLegacyRoleName("SUPPORT_STAFF"));

        // credit
        assertNull(converter.toLegacyRoleName("CONCEPTUALIZATION"));
        assertNull(converter.toLegacyRoleName("DATA_CURATION"));
        assertEquals("EDITOR", converter.toLegacyRoleName("EDITOR")); // special case, part of both sets of roles
        assertNull(converter.toLegacyRoleName("FORMAL_ANALYSIS"));
        assertNull(converter.toLegacyRoleName("FUNDING_ACQUISITION"));
        assertEquals("CO_INVESTIGATOR", converter.toLegacyRoleName("INVESTIGATION"));
        assertNull(converter.toLegacyRoleName("METHODOLOGY"));
        assertNull(converter.toLegacyRoleName("PROJECT_ADMINISTRATION"));
        assertNull(converter.toLegacyRoleName("RESOURCES"));
        assertNull(converter.toLegacyRoleName("SOFTWARE"));
        assertEquals("PRINCIPAL_INVESTIGATOR", converter.toLegacyRoleName("SUPERVISION"));
        assertNull(converter.toLegacyRoleName("VALIDATION"));
        assertNull(converter.toLegacyRoleName("VISUALIZATION"));
        assertEquals("AUTHOR", converter.toLegacyRoleName("WRITING_ORIGINAL_DRAFT"));
        assertEquals("EDITOR", converter.toLegacyRoleName("WRITING_REVIEW_EDITING"));
    }
    
    @Test
    public void testToRoleValue() {
        WorkContributorRoleConverter converter = new WorkContributorRoleConverter();
        
        // legacy
        assertEquals("author", converter.toRoleValue("AUTHOR"));
        assertEquals("assignee", converter.toRoleValue("ASSIGNEE"));
        assertEquals("editor", converter.toRoleValue("EDITOR"));
        assertEquals("chair-or-translator", converter.toRoleValue("CHAIR_OR_TRANSLATOR"));
        assertEquals("co-investigator", converter.toRoleValue("CO_INVESTIGATOR"));
        assertEquals("co-inventor", converter.toRoleValue("CO_INVENTOR"));
        assertEquals("graduate-student", converter.toRoleValue("GRADUATE_STUDENT"));
        assertEquals("other-inventor", converter.toRoleValue("OTHER_INVENTOR"));
        assertEquals("principal-investigator", converter.toRoleValue("PRINCIPAL_INVESTIGATOR"));
        assertEquals("postdoctoral-researcher", converter.toRoleValue("POSTDOCTORAL_RESEARCHER"));
        assertEquals("support-staff", converter.toRoleValue("SUPPORT_STAFF"));

        // credit
        assertEquals("http://credit.niso.org/contributor-roles/conceptualization/", converter.toRoleValue("CONCEPTUALIZATION"));
        assertEquals("http://credit.niso.org/contributor-roles/data-curation/", converter.toRoleValue("DATA_CURATION"));
        assertEquals("editor", converter.toRoleValue("EDITOR"));
        assertEquals("http://credit.niso.org/contributor-roles/formal-analysis/", converter.toRoleValue("FORMAL_ANALYSIS"));
        assertEquals("http://credit.niso.org/contributor-roles/funding-acquisition/", converter.toRoleValue("FUNDING_ACQUISITION"));
        assertEquals("http://credit.niso.org/contributor-roles/investigation/", converter.toRoleValue("INVESTIGATION"));
        assertEquals("http://credit.niso.org/contributor-roles/methodology/", converter.toRoleValue("METHODOLOGY"));
        assertEquals("http://credit.niso.org/contributor-roles/project-administration/", converter.toRoleValue("PROJECT_ADMINISTRATION"));
        assertEquals("http://credit.niso.org/contributor-roles/resources/", converter.toRoleValue("RESOURCES"));
        assertEquals("http://credit.niso.org/contributor-roles/software/", converter.toRoleValue("SOFTWARE"));
        assertEquals("http://credit.niso.org/contributor-roles/supervision/", converter.toRoleValue("SUPERVISION"));
        assertEquals("http://credit.niso.org/contributor-roles/validation/", converter.toRoleValue("VALIDATION"));
        assertEquals("http://credit.niso.org/contributor-roles/visualization/", converter.toRoleValue("VISUALIZATION"));
        assertEquals("http://credit.niso.org/contributor-roles/writing-original-draft/", converter.toRoleValue("WRITING_ORIGINAL_DRAFT"));
        assertEquals("http://credit.niso.org/contributor-roles/writing-review-editing/", converter.toRoleValue("WRITING_REVIEW_EDITING"));
    }
    
}
