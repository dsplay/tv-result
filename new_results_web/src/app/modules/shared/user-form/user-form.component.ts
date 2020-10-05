import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { asyncScheduler } from 'rxjs';
import { RouterService } from 'src/app/services/router.service';



@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, AfterViewInit {
  @Input() title: string;
  @Input() description: string;
  @Input() button: string;
  @Input() form: FormGroup;
  @Input() isNavigationEnabled = true;
  @Input() isLoginForm: boolean;
  @Input() isPasswordForm: boolean;
  @Input() isRegisterForm: boolean;
  @Input() isProfileForm: boolean;
  @Input() passwordDetail = true;
  @Input() customClass: string;
  buttonBack = true;

  @Output() eventSubmitForm: EventEmitter<void> = new EventEmitter();
  @Output() cancel: EventEmitter<void> = new EventEmitter();

  @ViewChild('inputEmail') inputEmail: ElementRef;

  constructor(private renderer: Renderer2, private routerService: RouterService) { }

  ngOnInit(): void {}

  ngAfterViewInit() {
    asyncScheduler.schedule(() => {
      if (this.isEmailDisabled() && this.inputEmail) {
        this.renderer.setAttribute(this.inputEmail.nativeElement, 'disabled', 'disabled');
      }
    });
  }

  public get isRegisterNavigationVisible() {
    return this.isRegisterForm && this.isNavigationEnabled;
  }

  public get isPasswordNavigationVisible() {
    return this.isPasswordForm && this.isNavigationEnabled;
  }

  public get classForm(): string {
    return this.customClass || `container-form-login`;
  }

  public get firstName(): FormControl {
    return this.form.get('first_name') as FormControl;
  }

  public get lastName(): FormControl {
    return this.form.get('last_name') as FormControl;
  }

  public get birthday(): FormControl {
    return this.form.get('birthday') as FormControl;
  }

  public get email(): FormControl {
    return this.form.get('email') as FormControl;
  }

  public get password(): FormControl {
    return this.form.get('password') as FormControl;
  }

  public get passwordConfirm(): FormControl {
    return this.form.get('password_confirm') as FormControl;
  }

  public get currentPassword(): FormControl {
    return this.form.get('current_password') as FormControl;
  }

  public isEmailDisabled(): boolean {
    return this.isProfileForm;
  }

  public cancelForm() {
    this.cancel.emit();
  }

  public submitForm() {
    this.eventSubmitForm.emit();
  }

  public confirmPasswords() {
    const error = {
      confirm: false
    };
    if (this.password.value !== this.passwordConfirm.value) {
      this.passwordConfirm.setErrors(error);
      this.password.setErrors(error);
    } else {
      this.password.setErrors(null);
      this.passwordConfirm.setErrors(null);
    }
  }

  backToHome(): void {

    this.routerService.goBack();
 
  }

  

}
