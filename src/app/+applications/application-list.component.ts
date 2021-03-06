import {Component,OnInit} from '@angular/core';

import {ToastService, UploadService} from '../shared/services';
import {HeaderComponent} from '../shared/header';
import {ApplicationService, ApplicationModel} from './shared';

@Component({
    templateUrl: './application-list.component.html',
    styleUrls: ['./application-list.component.css'],
    providers: [ApplicationService]
})
export class ApplicationListComponent implements OnInit {
    message: string;
    applications: ApplicationModel[];
    // 是否显示新建弹出框
    showAdd: boolean = false;
    showDelete: boolean = false;

    application: ApplicationModel = new ApplicationModel();

    uploadProgress: number;

    constructor(private applicationService: ApplicationService,
                private uploadService: UploadService,
                private toastService: ToastService) {
    }

    ngOnInit() {
        this.applicationService.getApplications().subscribe(
            data => this.applications = data.data,
            error => {throw error});
    }

    openCreateDialog() {
        this.showAdd = true;
    }

    openDeleteDialog(application: ApplicationModel) {
        this.application = application;
        this.showDelete = true;
    }
    
    createApp() {
        this.applicationService.createApplication(this.application.name, this.application.logo).subscribe(
            data => {
                this.applications.push(data);
                this.message = '创建成功';
                this.toastService.triggerToast('提示', this.message, 'success');
                this.application = new ApplicationModel();
                this.showAdd = false;
            },
            error => {throw error});
    }

    deleteApp() {
        this.applicationService.deleteApplication(this.application.id).subscribe(
            data => {
                // this.applications.find(application => application.id === appId);
                this.applications = this.applications.filter(application => application.id !== this.application.id);
                this.message = '删除成功';
                this.toastService.triggerToast('提示', this.message, 'success');
                this.application = new ApplicationModel();
                this.showDelete = false;
            },
            error => {
                this.application = new ApplicationModel();
                this.showDelete = false;
                throw error;
            });
    }

    cancel() {
        this.application = new ApplicationModel();
        this.showAdd = false;
        this.showDelete = false;
    }

    upload($event: any) {
        this.uploadService.getObserver().subscribe(progress =>  {
            this.uploadProgress = progress;
            console.log(progress);
        });
        this.uploadService.upload($event.target.files[0]).subscribe(
            url => this.application.logo = url,
            error => {throw error}
        );
    }
}
