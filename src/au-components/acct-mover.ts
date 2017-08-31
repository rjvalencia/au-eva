import {customElement, bindable} from 'aurelia-framework';
import {Eva} from '../eva';
import {AcctList} from '../models/acct-list';
import {Acct, Annotation} from '../models/acct';

@customElement('au-acct-mover')
export class AcctMover {
  //
  eva: Eva = Eva.getInstance();
  @bindable equationSide: string;
  @bindable sideAcctList: AcctList;
  @bindable moverDialogPositionElement;

  sideMoverAcctList: AcctList;
  mouseIsDown: boolean = false;
  selectedMoverRow: Element = null;
  moverDialogModal: HTMLElement = null;
  moverRowList: HTMLElement;


  onDialogOpen(event) {
    this.sideMoverAcctList = new AcctList(this.sideAcctList.equationSide);
    for (let listItem of this.sideAcctList) {
      this.sideMoverAcctList.push(listItem);
    }
    this.moverDialogModal.style.display = "block";
  }

  onDialogDone(event) {
    for (let i = 0; i < this.moverRowList.childElementCount; i++) {
      let listItem = (<any>this.moverRowList.children[i]).listItem as Acct | Annotation;
      listItem.intraSideSorter = i;
    }
    this.sideAcctList.refresh();
    this.sideMoverAcctList = null;
    this.moverDialogModal.style.display = "none";
  }

  onDialogCancel(event) {
    this.sideMoverAcctList = null;
    this.moverDialogModal.style.display = "none";
  }

  onRowMouseDown(event) {
    let targetRow: Element = event.currentTarget as Element;
    targetRow.children[0].classList.toggle('aaRowHover', false);
    targetRow.children[0].classList.toggle('aaDragging', true);
    this.mouseIsDown = true;
    this.selectedMoverRow = event.currentTarget;
  }

  onRowMouseUp(event) {
    let targetRow = event.currentTarget as Element;
    targetRow.children[0].classList.toggle('aaDragging', false);
    targetRow.children[0].classList.toggle('aaRowHover', true);
    this.mouseIsDown = false;
    this.selectedMoverRow = null;
  }

  onRowMouseLeave(event, listItem) {
    if (!this.mouseIsDown) {
      let targetRow = event.currentTarget as Element;
      targetRow.children[0].classList.toggle('aaRowHover', false);
    }
  }

  onRowMouseEnter(event, listItem) {
    if (!this.mouseIsDown) {
      let targetRow = event.currentTarget as Element;
      targetRow.children[0].classList.toggle('aaRowHover', true);
    }
  }

  onListMouseMove(event) {
    if (!this.mouseIsDown || !this.selectedMoverRow) {
      return;
    }
    let mouseY = event.clientY;
    let moverRowList = event.currentTarget;
    let previousSibling = this.selectedMoverRow.previousElementSibling;
    if (previousSibling && mouseY < this.selectedMoverRow.getBoundingClientRect().top) {
      moverRowList.insertBefore(this.selectedMoverRow, previousSibling);
      return;
    }
    let nextSibling = this.selectedMoverRow.nextElementSibling;
    if (nextSibling && mouseY >= nextSibling.getBoundingClientRect().top) {
      moverRowList.insertBefore(nextSibling, this.selectedMoverRow);
      return;
    }
  }

  elementY(element) {
    return element.getBoundingClientRect().top;
  };
}