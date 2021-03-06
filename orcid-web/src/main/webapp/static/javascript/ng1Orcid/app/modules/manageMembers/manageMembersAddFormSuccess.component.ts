declare var $: any;
declare var colorbox: any;
declare var getBaseUri: any;

//Import all the angular components

import { NgForOf, NgIf } from "@angular/common";

import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from "@angular/core";

import { Observable, Subject, Subscription } from "rxjs";
import { ModalService } from "../../shared/modal.service";
import { ManageMembersService } from "../../shared/manageMembers.service"
import { AdminActionsService } 
    from '../../shared/adminActions.service';  

@Component({
  selector: "manage-member-add-form-success-ng2",
  template: scriptTmpl("manage-member-add-form-success-ng2-template")
})
export class ManageMemberAddFormSuccessComponent
  implements AfterViewInit, OnDestroy, OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  newMember

  constructor(private modalService: ModalService,
			  private adminActionsService: AdminActionsService) {

  }

  //Default init functions provid   ed by Angular Core
  ngAfterViewInit() {
    //Fire functions AFTER the view inited. Useful when DOM is required or access children directives
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    
    this.modalService.notifyObservable$.subscribe ( (data)=>{
      if (data && data.moduleId === "modalAddMemberSuccess") {
        this.newMember = data.newMember;
      }
    })

  }

   switchUser(obj): void {
		this.adminActionsService.switchUserPost(obj).subscribe(
		        data => {
		          window.location.replace(getBaseUri() + '/my-orcid');
		        },
		        error => {
		          // reload page anyway
		          // switchUser request is handled by OrcidSwitchUserFilter.java which redirects /switch-user to /my-orcid
		          // in non-local environments neither request completes successfully, although the user has been successfully switched
		          window.location.replace(getBaseUri() + '/my-orcid');
		        }
		      );
    };

  closeModal() {
    this.modalService.notifyOther({
      action: "close",
      moduleId: "modalAddMemberSuccess"
    });
  }
  
  getBaseUri() : String {
      return getBaseUri();
  };
}
