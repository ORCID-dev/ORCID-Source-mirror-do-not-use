declare var $: any;

import {  Component, OnDestroy, OnInit, ChangeDetectorRef } 
    from '@angular/core';

import { Observable, Subject, Subscription } 
    from 'rxjs'; 

import { takeUntil } 
    from 'rxjs/operators';

import { FeaturesService }
    from '../../shared/features.service'

import { SearchService } 
    from '../../shared/search.service';

@Component({
    selector: 'search-ng2',
    template:  scriptTmpl("search-ng2-template")
})
export class SearchComponent implements OnDestroy, OnInit {
    private ngUnsubscribe: Subject<void> = new Subject<void>();
    private subscription: Subscription; 

    allResults: any;
    areMoreResults: any;
    hasErrors: any;
    input: any;
    newResults: any;
    numFound: any;
    searchResults: any;
    searchResultsLoading: boolean;
    showMoreLoading: boolean;
    showNoResultsAlert: boolean;
    results: any;
    resultsWithNames: any;
    resultsObservable: any;
    resultsShowing: any;
    url: string;
    constructor(
        private cdr:ChangeDetectorRef,
        private featuresService: FeaturesService,
        private searchSrvc: SearchService,
       
    ) {
        this.allResults = new Array();
        this.areMoreResults = false;
        this.hasErrors = false;
        this.input = {};
        this.input.rows = 10;
        this.input.start = 0;
        this.numFound = 0;
        this.searchResultsLoading = false;
        this.showMoreLoading = false;
        this.showNoResultsAlert = false;
        this.results = new Array();
        this.resultsShowing = 0;
    }

    concatPropertyValues(array: any, propertyName: any){
        if(typeof array === 'undefined'){
            return '';
        }
        else{
            return $.map(array, function(o){ return o[propertyName]; }).join(', ');
        }
    };

    getBaseUri(): String {
        return getBaseUri();
    };

    getFirstResults(input: any){       
        this.showNoResultsAlert = false;
        this.allResults = new Array();
        this.numFound = 0;
        this.input.start = 0;
        this.input.rows = 10;
        this.areMoreResults = false;
        if(this.searchSrvc.isValid(this.input)){
            this.hasErrors = false;
            this.searchResultsLoading = true;
            this.search(this.input);
        }
        else{
            this.hasErrors = true;
        }
    };

    getMoreResults(): any {
        this.showMoreLoading = true;
        this.input.start += 10;
        this.search(this.input);
    };

    search(input: any) {
        this.searchSrvc.getResults(this.input).pipe(    
            takeUntil(this.ngUnsubscribe)
        ).subscribe(
            searchResults => {
                this.newResults = searchResults['result'];
                this.numFound = searchResults['num-found'];
                this.searchResultsLoading = false;
                this.showMoreLoading = false;

                if (this.newResults) {
                    this.getDetails(this.newResults);
                    this.allResults = this.allResults.concat(this.newResults); 
                    this.cdr.detectChanges();
                }
                
                if(!this.numFound){
                    this.showNoResultsAlert = true;
                }

                this.areMoreResults = this.numFound > (this.input.start + this.input.rows);
                
                //if less than 10 results, show total number found
                if(this.numFound && this.numFound <= this.input.rows){
                    this.resultsShowing = this.numFound;
                }

                //if more than 10 results increment num found by 10
                if(this.numFound && this.numFound > this.input.rows){
                    if(this.numFound > (this.input.start + this.input.rows)){
                        this.resultsShowing = this.input.start + this.input.rows;
                    } else {
                        this.resultsShowing = (this.input.start + this.input.rows) - (this.input.rows - (this.numFound % this.input.rows));
                    }
                }
                
                var bottom = null;
                var newSearchResults = null;
                var newSearchResultsTop = null;
                var showMoreButtonTop = null;
                newSearchResults = $('.new-search-result');
                
                if(newSearchResults.length > 0){
                    newSearchResults.fadeIn(1200);
                    newSearchResults.removeClass('new-search-result');
                    newSearchResultsTop = newSearchResults.offset().top;
                    showMoreButtonTop = $('#show-more-button-container').offset().top;
                    bottom = $(window).height();
                    if(showMoreButtonTop > bottom){
                        $('html, body').animate(
                            {
                                scrollTop: newSearchResultsTop
                            },
                            1000
                        );
                    }
                }

                this.cdr.detectChanges();
                
            }

        );
    }

    getAffiliations(result: any){
        if(!result['affiliationsRequestSent']){
            result['affiliationsRequestSent'] = true;
            result['affiliations'] = [];
            var orcid = result['orcid-identifier'].path;
            this.searchSrvc.getAffiliations(orcid).subscribe(
                affiliationsResult => {
                    
                    if(affiliationsResult.employments['affiliation-group'].length > 0){
                        for(var i in affiliationsResult.employments['affiliation-group']){
                            if (result['affiliations'].indexOf(affiliationsResult.employments['affiliation-group'][i]['summaries'][0]['employment-summary']['organization']['name']) < 0){
                                result['affiliations'].push(affiliationsResult.employments['affiliation-group'][i]['summaries'][0]['employment-summary']['organization']['name']);
                            }
                        }
                    }
                    if(affiliationsResult.educations['affiliation-group'].length > 0){
                        for(var i in affiliationsResult.educations['affiliation-group']){
                            if (result['affiliations'].indexOf(affiliationsResult.educations['affiliation-group'][i]['summaries'][0]['education-summary']['organization']['name']) < 0){
                                result['affiliations'].push(affiliationsResult.educations['affiliation-group'][i]['summaries'][0]['education-summary']['organization']['name']);
                            }
                        }
                    }
                }
            );
        } 
    };

    getNames(result: any){
        if(!result['namesRequestSent']){
            result['namesRequestSent'] = true;
            var name="";
            var orcid = result['orcid-identifier'].path;
            this.searchSrvc.getNames(orcid).subscribe(
                namesResult => {
                    if (namesResult['name']['given-names']){
                        result['given-names'] = namesResult['name']['given-names']['value'];
                    }
                    if(namesResult['name']['family-name']){
                        result['family-name'] = namesResult['name']['family-name']['value'];
                    }
                    if(namesResult['other-names']['other-name']) {
                        result['other-name'] = namesResult['other-names']['other-name'];
                    }
                }
            );
        } 
    };

    getDetails(orcidList: any) {
       for(var i = 0; i < orcidList.length; i++){
            this.getNames(orcidList[i]);
            this.getAffiliations(orcidList[i]);
       }
    };
    
    areResults(): any {
        return this.allResults.length > 0;
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    };

    ngOnInit() {
        var urlParams = new URLSearchParams(location.search);
        this.input.text = urlParams.get('searchQuery');
        if(this.input.text){
            this.searchResultsLoading = true;
            this.search(this.input);
        } else{
            this.showNoResultsAlert = true;
        }
    }

    isValidOrcidId(): boolean{
        return this.searchSrvc.isValidOrcidId(this.input)
    }

}
