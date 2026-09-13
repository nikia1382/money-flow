import { TestBed } from '@angular/core/testing';
import { Notifications } from '../pages/notifications/notifications';


describe('Notifications', () => {
  let service: Notifications;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Notifications);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
