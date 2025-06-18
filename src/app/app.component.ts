import { Component } from '@angular/core';
import { OtpValidationComponent } from './features/otp-validation/otp-validation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [OtpValidationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'OTPDistributioin';
}
