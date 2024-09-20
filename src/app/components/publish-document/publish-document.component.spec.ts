import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishDocumentComponent } from './publish-document.component';

describe('PublishDocumentComponent', () => {
  let component: PublishDocumentComponent;
  let fixture: ComponentFixture<PublishDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishDocumentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PublishDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
