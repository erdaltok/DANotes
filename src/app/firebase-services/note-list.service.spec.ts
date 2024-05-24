import { TestBed } from '@angular/core/testing';

import { NoteListService } from './note-list.service';

describe('NoteListService', () => {
  let service: NoteListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoteListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
