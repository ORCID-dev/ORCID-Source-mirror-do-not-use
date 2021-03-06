<div class="row col-md-12">
    <a href="{{getBaseUri()}}/orcid-search/search" class="settings-button" title="${springMacroRequestContext.getMessage("public-layout.search.advanced")?replace("<br />", " ")?replace("'", "\\'")}">${springMacroRequestContext.getMessage("public-layout.search.advanced")?replace("<br />", " ")?replace("'", "\\'")}</a>
    <p class="result-counter-container" *ngIf="areResults()">${springMacroRequestContext.getMessage("search_results.showing")} {{resultsShowing}} ${springMacroRequestContext.getMessage("search_results.of")} {{numFound}} <span *ngIf="numFound==1">${springMacroRequestContext.getMessage("search_results.result")}</span><span *ngIf="numFound>1">${springMacroRequestContext.getMessage("search_results.results")}</span></p>
    <table class="table table-striped" *ngIf="areResults()">
        <thead>
            <tr>
                <th>${springMacroRequestContext.getMessage("search_results.thORCIDID")}</th>
                <th>${springMacroRequestContext.getMessage("search_results.thGivenname")}</th>
                <th>${springMacroRequestContext.getMessage("search_results.thFamilynames")}</th>
                <th>${springMacroRequestContext.getMessage("search_results.thOthernames")}</th>
                <th>${springMacroRequestContext.getMessage("workspace_bio.Affiliations")}</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let result of allResults" class="new-search-result">
                <td class='search-result-orcid-id'><a href="{{result['orcid-identifier'].uri}}">{{result['orcid-identifier'].uri}}</a></td>
                <td>{{result['given-names']}}</td>
                <td>{{result['family-name']}}</td>  
                <td>{{concatPropertyValues(result['other-name'], 'content')}}</td>
                <td>{{result['affiliations'].join(", ")}}</td>
            </tr>
        </tbody>
    </table>
    <div id="show-more-button-container">
        <button id="show-more-button" type="submit" class="btn btn-primary" (click)="getMoreResults()" *ngIf="areMoreResults">${springMacroRequestContext.getMessage("notifications.show_more")}</button>
        <span *ngIf="showMoreLoading"><i class="glyphicon glyphicon-refresh spin x2 green"></i></span>
    </div>
    <div *ngIf="showNoResultsAlert" class="alert alert-error"><@spring.message "orcid.frontend.web.no_results"/></div>
    <div id="search-error-alert" class="orcid-hide alert alert-error"><@spring.message "orcid.frontend.web.search_error"/></div>
</div>