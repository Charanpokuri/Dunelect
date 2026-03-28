import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LineService } from '../../services/line.service';
 
@Component({
  selector: 'app-lines',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lines.html',
  styleUrls: ['./lines.css']
})
export class LinesComponent implements OnInit {
  lines: any[] = [];
  pagedLines: any[] = [];
  searchId: number | null = null;
 
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 0;
 
  currentLine: any = { lineName: '', location: '' };
  isEditMode: boolean = false;
 
  constructor(private lineService: LineService, private cdr: ChangeDetectorRef) {}
 
  async ngOnInit() {
    await this.loadLines();
  }
 
  async loadLines() {
    try {
      this.lines = await this.lineService.getAllLines();
      this.updatePage();
    } catch (error) {
      console.error("Load failed", error);
    }
  }
 
  async fetchSingleLine() {
    if (!this.searchId) {
      await this.loadLines();
      return;
    }
    try {
      const line = await this.lineService.getLineById(this.searchId);
      this.pagedLines = line ? [line] : [];
      this.totalPages = line ? 1 : 0;
      this.currentPage = 1;
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Search failed", error);
      this.pagedLines = [];
      this.totalPages = 0;
      this.cdr.detectChanges();
    }
  }
 
  updatePage() {
    if (!this.lines || this.lines.length === 0) {
      this.pagedLines = [];
      this.totalPages = 0;
      return;
    }
    this.totalPages = Math.ceil(this.lines.length / this.pageSize);
    const start = (this.currentPage - 1) * this.pageSize;
    this.pagedLines = this.lines.slice(start, start + this.pageSize);
    this.cdr.detectChanges();
  }
 
  onPageSizeChange() {
    if (this.pageSize < 1) this.pageSize = 1;
    this.currentPage = 1;
    this.updatePage();
  }
 
  changePage(delta: number) {
    const next = this.currentPage + delta;
    if (next >= 1 && next <= this.totalPages) {
      this.currentPage = next;
      this.updatePage();
    }
  }
 
  async saveLine() {
    try {
      if (this.isEditMode) {
        await this.lineService.updateLine(this.currentLine.lineId, this.currentLine);
      } else {
        await this.lineService.createLine(this.currentLine);
      }
      this.resetForm();
      await this.loadLines();
    } catch (error) {
      alert("Save failed");
    }
  }
 
  async deleteLine(id: number) {
    if (confirm("Are you sure you want to delete this line?")) {
      try {
        await this.lineService.deleteLine(id);
        await this.loadLines();
      } catch (error) {
        alert("Delete failed");
      }
    }
  }
 
  editLine(line: any) {
    this.isEditMode = true;
    this.currentLine = { ...line };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  resetForm() {
    this.currentLine = { lineName: '', location: '' };
    this.isEditMode = false;
  }
}