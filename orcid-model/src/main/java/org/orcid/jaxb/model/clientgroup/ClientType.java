/**
 * =============================================================================
 *
 * ORCID (R) Open Source
 * http://orcid.org
 *
 * Copyright (c) 2012-2014 ORCID, Inc.
 * Licensed under an MIT-Style License (MIT)
 * http://orcid.org/open-source-license
 *
 * This copyright and license information (including a link to the full license)
 * shall be included in its entirety in all copies or substantial portion of
 * the software.
 *
 * =============================================================================
 */
//
// This file was generated by the JavaTM Architecture for XML Binding(JAXB) Reference Implementation, vJAXB 2.1.10 in JDK 6 
// See <a href="http://java.sun.com/xml/jaxb">http://java.sun.com/xml/jaxb</a> 
// Any modifications to this file will be lost upon recompilation of the source schema. 
// Generated on: 2012.04.23 at 12:45:35 PM BST 
//

package org.orcid.jaxb.model.clientgroup;

import java.util.HashSet;
import java.util.Set;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlEnumValue;
import javax.xml.bind.annotation.XmlType;

import org.orcid.jaxb.model.message.ScopePathType;

/**
 * <p>
 * Java class for client-type.
 * 
 * <p>
 * The following schema fragment specifies the expected content contained within
 * this class.
 * <p>
 * 
 * <pre>
 * &lt;simpleType name="client-type">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="creator"/>
 *     &lt;enumeration value="premium-creator"/>
 *     &lt;enumeration value="updater"/>
 *     &lt;enumeration value="premium-updater"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "client-type")
@XmlEnum
public enum ClientType {

    //@formatter:off
    @XmlEnumValue("creator")
    CREATOR("creator"), 
    @XmlEnumValue("premium-creator")
    PREMIUM_CREATOR("premium-creator"), 
    @XmlEnumValue("updater")
    UPDATER("updater"), 
    @XmlEnumValue("premium-updater")
    PREMIUM_UPDATER("premium-updater"),
    @XmlEnumValue("public-client")
    PUBLIC_CLIENT("public-client");
    //@formatter:on

    private final String value;

    ClientType(String v) {
        value = v;
    }

    public String value() {
        return value;
    }

    public static ClientType fromValue(String v) {
        for (ClientType c : ClientType.values()) {
            if (c.value.equals(v)) {
                return c;
            }
        }
        throw new IllegalArgumentException(v);
    }
    
    public static Set<String> getScopes(ClientType clientType) {
        switch (clientType) {
        case PREMIUM_CREATOR:
            return premiumCreatorScopes();
        case CREATOR:
            return creatorScopes();
        case PREMIUM_UPDATER:
            return premiumUpdaterScopes();
        case UPDATER:
            return updaterScopes();
        case PUBLIC_CLIENT:
            return new HashSet<>(ScopePathType.getScopesAsStrings(ScopePathType.AUTHENTICATE, ScopePathType.READ_PUBLIC, ScopePathType.OPENID));
        default:
            throw new IllegalArgumentException("Unsupported client type: " + clientType);
        }
    }

    public static Set<String> premiumCreatorScopes() {
        Set<String> creatorScopes = creatorScopes();
        addPremiumOnlyScopes(creatorScopes);
        return creatorScopes;
    }

    public static Set<String> creatorScopes() {
        return ScopePathType.ORCID_PROFILE_CREATE.getCombinedAsStrings();
    }

    public static Set<String> premiumUpdaterScopes() {
        Set<String> updaterScopes = updaterScopes();
        addPremiumOnlyScopes(updaterScopes);
        return updaterScopes;
    }

    public static Set<String> updaterScopes() {
        return new HashSet<>(ScopePathType.getScopesAsStrings(ScopePathType.AFFILIATIONS_CREATE, ScopePathType.AFFILIATIONS_READ_LIMITED,
                ScopePathType.AFFILIATIONS_UPDATE, ScopePathType.AUTHENTICATE, ScopePathType.FUNDING_CREATE, ScopePathType.FUNDING_READ_LIMITED,
                ScopePathType.FUNDING_UPDATE, ScopePathType.ORCID_BIO_EXTERNAL_IDENTIFIERS_CREATE, ScopePathType.ORCID_BIO_READ_LIMITED, ScopePathType.ORCID_BIO_UPDATE,
                ScopePathType.ORCID_PROFILE_READ_LIMITED, ScopePathType.ORCID_WORKS_CREATE, ScopePathType.ORCID_WORKS_READ_LIMITED, ScopePathType.ORCID_WORKS_UPDATE,
                ScopePathType.READ_PUBLIC, ScopePathType.ACTIVITIES_UPDATE, ScopePathType.PERSON_UPDATE, ScopePathType.ACTIVITIES_READ_LIMITED,
                ScopePathType.READ_LIMITED, ScopePathType.PERSON_READ_LIMITED, ScopePathType.PEER_REVIEW_CREATE, ScopePathType.PEER_REVIEW_UPDATE,
                ScopePathType.PEER_REVIEW_READ_LIMITED, ScopePathType.GROUP_ID_RECORD_READ, ScopePathType.GROUP_ID_RECORD_UPDATE, ScopePathType.OPENID));
    }

    private static void addPremiumOnlyScopes(Set<String> scopes) {
        scopes.add(ScopePathType.WEBHOOK.value());
        // scopes.add(ScopePathType.PREMIUM_NOTIFICATION.value());
    }

}
