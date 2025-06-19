import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, output, ViewChild } from '@angular/core';
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

  @Input() timer: number = 2;
  second: number = 60;
  isExpired: boolean = false;
  private intervalId: any;

  @Output() verify: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private changeDetected: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.d1Input.nativeElement.focus();
    this.startTimer();
  }

  startTimer(): void {
    this.ngZone.runOutsideAngular(() => {
      let i: number = 0;
      this.intervalId = setInterval(() => {
        if (i == 0) {
          this.timer--;
          this.second--;
          this.changeDetected.detectChanges();
          i++;
        }
        this.ngZone.run(() => {
          if (this.timer >= 0 && this.second > 0) {
            this.second--;
          } else if (this.timer >= 0 && this.second == 0) {
            this.timer--;
            this.second = 59;
          } else {
            this.isExpired = true;
            this.timer = 0;
            this.second = 0;
            clearInterval(this.intervalId);
            this.form.disable();
            this.changeDetected.detectChanges();
          }
        });
      }, 1000);
    });
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

  onResent(): void {
    clearInterval(this.intervalId);
    this.second = 60;
    this.form.enable();
    this.startTimer();
  }

  onVerify(): void {
    const otp = Object.values(this.form.value).join('');
    this.verify.emit(otp);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
