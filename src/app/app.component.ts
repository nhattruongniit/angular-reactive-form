import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  phoneRegex = '/(?:d{1}s)?(?(d{3}))?-?s?(d{3})-?s?(d{4})/g';
  hasSaved = false;
  formValue: any;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.hasSaved = !!localStorage.getItem('form');

    if (this.hasSaved) {
      const formValue = JSON.parse(localStorage.getItem('form'));
      this.generateForm(formValue);
    } else {
      this.initForm();
    }
  }

  initForm() {
    this.form = this.formBuilder.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
      dateOfBirth: ['', Validators.required],
      emails: this.formBuilder.array([this.createEmailControl()]),
      phoneNumbers: this.formBuilder.array([this.createPhoneControl()]),
      addresses: this.formBuilder.array([this.createAddressControl()])
    });
  }

  generateForm(formValue) {
    this.form = this.formBuilder.group({
      firstName: [formValue.firstName],
      lastName: [formValue.lastName],
      dateOfBirth: [formValue.dateOfBirth],
      emails: this.formBuilder.array([this.createEmailControl()]),
      phoneNumbers: this.formBuilder.array([this.createPhoneControl()]),
      addresses: this.formBuilder.array([this.createAddressControl()])
    });

    formValue.emails.forEach((e, index) => {
      if (index === 0) {
        this.getEmailControls(this.form)[index].setValue(e);
      } else {
        this.getEmailControls(this.form).push(this.formBuilder.control(e));
      }
    });

    formValue.phoneNumbers.forEach((p, index) => {
      if (index === 0) {
        this.getPhoneControls(this.form)[index].setValue(p);
      } else {
        this.getPhoneControls(this.form).push(this.formBuilder.control(p));
      }
    });

    formValue.addresses.forEach((a, index) => {
      if (index === 0) {
        this.getAddressControls(this.form)
          [index].get('street')
          .setValue(a.street);
        this.getAddressControls(this.form)
          [index].get('city')
          .setValue(a.city);
        this.getAddressControls(this.form)
          [index].get('state')
          .setValue(a.state);
      } else {
        this.getAddressControls(this.form).push(this.processAddressValues(a));
      }
    });
  }

  processAddressValues(address) {
    return this.formBuilder.group({
      street: [address.street],
      city: [address.city],
      state: [address.state]
    });
  }

  submit() {
    this.formValue = this.form.value;
    this.getEmailControls(this.form).length = 1;
    this.getAddressControls(this.form).length = 1;
    this.getPhoneControls(this.form).length = 1;
    this.form.reset();
  }

  private createEmailControl() {
    return this.formBuilder.control('', Validators.compose([Validators.required, Validators.email]));
  }

  private createPhoneControl() {
    return this.formBuilder.control('', Validators.required);
  }

  private createAddressControl() {
    return this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  onSaveClick() {
    if (confirm('Save?')) {
      localStorage.setItem('form', JSON.stringify(this.form.value));
      this.getEmailControls(this.form).length = 1;
      this.getAddressControls(this.form).length = 1;
      this.getPhoneControls(this.form).length = 1;
      this.form.reset();
    }
  }

  onClearLocalStorageClick() {
    if (confirm('Clear?')) {
      localStorage.clear();
      this.getEmailControls(this.form).length = 1;
      this.getAddressControls(this.form).length = 1;
      this.getPhoneControls(this.form).length = 1;
      this.form.reset();
      this.hasSaved = false;
    }
  }

  onRemoveEmailClick(index) {
    (<FormArray>this.form.get('emails')).removeAt(index);
  }

  onAddEmailClick() {
    (<FormArray>this.form.get('emails')).push(this.createEmailControl());
  }

  onRemovePhoneClick(index) {
    (<FormArray>this.form.get('phoneNumbers')).removeAt(index);
  }

  onAddPhoneClick() {
    (<FormArray>this.form.get('phoneNumbers')).push(this.createPhoneControl());
  }

  onRemoveAddressClick(index) {
    (<FormArray>this.form.get('addresses')).removeAt(index);
  }

  onAddAddressClick() {
    (<FormArray>this.form.get('addresses')).push(this.createAddressControl());
  }

  private getEmailControls(form: FormGroup) {
    return (form.get('emails') as FormArray).controls;
  }

  private getPhoneControls(form: FormGroup) {
    return (form.get('phoneNumbers') as FormArray).controls;
  }

  private getAddressControls(form: FormGroup) {
    return (form.get('addresses') as FormArray).controls;
  }
}
