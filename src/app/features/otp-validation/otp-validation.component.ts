import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-otp-validation',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-validation.component.html',
  styleUrl: './otp-validation.component.css'
})
export class OtpValidationComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('d1') d1Input!: ElementRef<HTMLInputElement>;

  timer: number = 60;
  isExpired: boolean = false;
  private intervalId: any;

  constructor(private fb: FormBuilder, private ngZone: NgZone) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.d1Input.nativeElement.focus();
    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      this.ngZone.run(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          this.isExpired = true;
          clearInterval(this.intervalId);
        }
      });
    }, 1000);
  }

  form: FormGroup = this.fb.group({
    d1: ['', [Validators.required, Validators.pattern('[0-9]')]],
    d2: ['', [Validators.required, Validators.pattern('[0-9]')]],
    d3: ['', [Validators.required, Validators.pattern('[0-9]')]],
    d4: ['', [Validators.required, Validators.pattern('[0-9]')]],
    d5: ['', [Validators.required, Validators.pattern('[0-9]')]],
    d6: ['', [Validators.required, Validators.pattern('[0-9]')]],
  });

  onKey(event: KeyboardEvent, prevInput: HTMLInputElement | null, nextInput: HTMLInputElement | null) {

    if (this.isExpired) return;

    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && prevInput) {
      prevInput.focus();
    } else if (input.value && nextInput) {
      nextInput.focus();
    }
  }

  submitOtp() {
    if (this.form.valid) {
      const otp = Object.values(this.form.value).join('');
      console.log('Entered OTP:', otp);
    } else {
      alert('Please enter all 6 digits.');
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
