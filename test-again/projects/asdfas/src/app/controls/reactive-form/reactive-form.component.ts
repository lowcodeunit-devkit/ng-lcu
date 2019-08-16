import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, CanDeactivate } from '@angular/router';
import { FormGroup, AbstractControl, FormControl, Validators } from '@angular/forms';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { StatesModel } from '../../models/states.model';
import { ReactiveFormService } from '../../services/reactive-form.service';
import { ReactiveFormModel } from './../../models/reactive-form.model';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs/internal/Subscription';
import { PasswordValidator, EmailValidator, UserNameValidator, ValidationMessages, ZipcodeValidator } from '@lcu-ide/common';
import { startWith } from 'rxjs/operators';


@Component({
  selector: 'lcu-reactive-form',
  templateUrl: './reactive-form.component.html',
  styleUrls: ['./reactive-form.component.scss']
})
export class ReactiveFormComponent implements OnInit {

  /**
   * Local property for session values
   */
  protected _sessionValues: ReactiveFormModel;

  /**
   * Local property for selecting terms
   */
  protected _termsChecked: boolean;

  /**
   * Getter / Setter for session values
   */
  protected get sessionValues(): ReactiveFormModel {
    if (sessionStorage.length === 0) {
      return new ReactiveFormModel();
    }

    return JSON.parse(sessionStorage.getItem('formValues'));
  }

  protected set sessionValues(val: ReactiveFormModel) {
    this._sessionValues = val;
  }

  /**
   * Input property for checking terms
   */
  @Input('terms-checked')
  public get TermsChecked(): boolean {
    return this._termsChecked;
  }

  public set TermsChecked(val: boolean) {
    console.log('TermsChecked ', val);
    this._termsChecked = val;
  }

  /**
   * Access address field
   */
  public get AddressControl(): AbstractControl {
    return this.Form.get('addressControl');
  }

  /**
   * Access city field
   */
  public get CityControl(): AbstractControl {
    return this.Form.get('cityControl');
  }

  /**
   * Access confirm password field
   */
  public get ConfirmPasswordControl(): AbstractControl {
    return this.Form.get('confirmPasswordControl');
  }

  /**
   * Access email field
   */
  public get EmailControl(): AbstractControl {
    return this.Form.get('emailControl');
  }

  /**
   * Access first name field
   */
  public get FirstNameControl(): AbstractControl {
    return this.Form.get('firstNameControl');
  }

  /**
   * Access last name field
   */
  public get LastNameControl(): AbstractControl {
    return this.Form.get('lastNameControl');
  }

  /**
   * Access state field
   */
  public get StateControl(): AbstractControl {
    return this.Form.get('stateControl');
  }

  /**
   * Access terms field
   */
  public get TermsControl(): AbstractControl {
    return this.Form.get('termsControl');
  }

  /**
   * Access password field
   */
  public get PasswordControl(): AbstractControl {
    return this.Form.get('passwordControl');
  }

  /**
   * Access username field
   */
  public get UsernameControl(): AbstractControl {
    return this.Form.get('usernameControl');
  }

  /**
   * Access zipcode field
   */
  public get ZipcodeControl(): AbstractControl {
    return this.Form.get('zipcodeControl');
  }

  /**
   * Toggle to show / hide password value
   */
  public HidePassword: boolean = true;

  /**
   * Toggle to show / hide password value
   */
  public HideConfirmPassword: boolean = true;

  public IsHandsetMode: Observable<boolean>;
  protected observerSubscription: Subscription;

/**
 * property for reactive form
 */
  public Form: FormGroup;

  /**
   * Title
   */
  public PageTitle: string;

  /**
   * property to states list
   */
  public States: Array<StatesModel>;

  /**
   * property for filtered states list
   */
  public StatesFiltered: Observable<Array<StatesModel>>;

  /**
   * propery for form title
   */
  public Title: string;

  /**
   * propery for form title icon
   */
  public TitleIcon: string;

  /**
   * propery for form subtitle
   */
  public SubTitle: string;

  /**
   * Confirm password validation
   */
  public VMConfirmPassword: ValidationMessages;

  /**
   * Email validation
   */
  public VMEmail: ValidationMessages;

  /**
   * Password validation
   */
  public VMPassword: ValidationMessages;

  /**
   * Username validation
   */
  public VMUsername: ValidationMessages;

  public VMZipcode: ValidationMessages;


  constructor(
    protected activatedRoute: ActivatedRoute,
    protected reactiveFormService: ReactiveFormService,
    protected breakpointObserver: BreakpointObserver) {

    this.Title = 'Angular Reactive Form';
    this.TitleIcon = 'vertical_split';
    this.SubTitle = 'Responsive Form';
    this.PageTitle = 'Reactive Form';

    this.VMConfirmPassword = ValidationMessages.ConfirmPassword;
    this.VMEmail = ValidationMessages.Email;
    this.VMPassword = ValidationMessages.Password;
    this.VMUsername = ValidationMessages.UserName;
    this.VMZipcode = ValidationMessages.Zipcode;

    this.monitorBreakpoints();
  }

  ngOnInit() {

    this.setupForm();

    this.getStates();

    this.setupFilteringStates();

    this.activatedRoute.paramMap.subscribe(params => {
      console.log('reactive form param', params.get('id'));
    });
  }

  /**
   * Register
   */
  public Register(): void {
    console.log('register');
  }

  /**
   * Clear form
   */
  public ClearForm(): void {
    this.Form.reset();
  }

  public ShowTermsAndConditions(): void {
    console.log('show terms & conditions');
  }

  /**
   * Setup the reactive form
   */
  protected setupForm(): void {
    this.Form = new FormGroup({
      firstNameControl: new FormControl(this.sessionValues.FirstName, Validators.compose([Validators.required])),
      lastNameControl: new FormControl(this.sessionValues.lastName, Validators.compose([Validators.required])),
      usernameControl: new FormControl(this.sessionValues.Username, Validators.compose([
        Validators.required,
        Validators.pattern(UserNameValidator.UsernameNoUnderscoreDotPattern)])),
      emailControl: new FormControl(this.sessionValues.Email, Validators.compose(
        [
          Validators.required,
          Validators.pattern(EmailValidator.EmailPatternDomain)])),
      passwordControl: new FormControl(this.sessionValues.Password, Validators.compose([
        Validators.required,
        Validators.pattern(PasswordValidator.StrongPassword)
      ])),
      confirmPasswordControl: new FormControl(this.sessionValues.ConfirmPassword, Validators.compose([Validators.required])),
      addressControl: new FormControl(this.sessionValues.Address, Validators.compose([Validators.required])),
      cityControl: new FormControl(this.sessionValues.City, Validators.compose([Validators.required])),
      stateControl: new FormControl(this.sessionValues.State, Validators.compose([Validators.required])),
      termsControl: new FormControl(this.sessionValues.Terms, Validators.compose([Validators.requiredTrue])),
      zipcodeControl: new FormControl(this.sessionValues.Zipcode, Validators.compose([
        Validators.required,
        Validators.pattern(ZipcodeValidator.ZipcodeExpression('US'))
      ]))
    });

    this.Form.validator = PasswordValidator.PasswordsMatch(this.PasswordControl, this.ConfirmPasswordControl);

    this.onChanges();
  }

  protected getFormValues(): void {

  }

  /**
   * Return list of states
   */
  protected getStates(): void {
    this.reactiveFormService.GetStates().subscribe((data: Array<StatesModel>) => {
      this.States = data;
    });
  }

  /**
   * Listen for form changes
   */
  protected onChanges(): void {

    this.Form.valueChanges.subscribe((val: ReactiveFormModel) => {
      this.updateSessionStorage(val);
    });
  }

   /**
    * Store registration values
    * 
    * We need to use the state for this, but for now this will work
    */
   protected updateSessionStorage(val: ReactiveFormModel): void {
    sessionStorage.setItem('formValues', JSON.stringify(val));
  }

  /**
   * Breakpoints for screen sizes
   */
  protected monitorBreakpoints(): void {
    this.observerSubscription = this.breakpointObserver.observe([Breakpoints.Small])
    .subscribe((result: BreakpointState) => {
      console.log(result.matches);
    });
  }

  /**
   * Filter state list
   * 
   * @param val string to filter state list
   */
  protected filterStateList(val: string): Array<StatesModel> {
    const filterValue: string = val.toLocaleLowerCase();

    return this.States.filter(state => state.Name.toLocaleLowerCase().indexOf(filterValue) === 0);
  }

  protected setupFilteringStates(): void {
    this.StatesFiltered = this.StateControl.valueChanges
    .pipe(
      startWith(''),
      map(state => state ? this.filterStateList(state) : this.States.slice())
    );
  }

  /**
   * Check if form has changes, if so warn the user
   */
  public CanDeactivate(): boolean {
    return !this.Form.dirty && !this.Form.touched;
  }

}
