"use strict";
(() => {
  // lineageViewerTS/src/utils/vscodeAPI.ts
  var vscodeApi;
  function getVsCodeApi() {
    if (!vscodeApi) {
      if (typeof window !== "undefined" && typeof window.acquireVsCodeApi === "function") {
        vscodeApi = window.acquireVsCodeApi();
      } else {
        console.warn("acquireVsCodeApi is not available. Using mock VS Code API.");
        let mockState = {};
        vscodeApi = {
          postMessage: (message) => {
            console.log("[Mock VS Code API] postMessage:", message);
          },
          getState: () => {
            console.log("[Mock VS Code API] getState:", mockState);
            return mockState;
          },
          setState: (state) => {
            console.log("[Mock VS Code API] setState:", state);
            mockState = state;
          }
        };
      }
    }
    return vscodeApi;
  }

  // lineageViewerTS/src/utils/Utility.ts
  var Utility = class {
    static generateId() {
      return Math.random().toString(36).substring(2, 9);
    }
  };

  // lineageViewerTS/src/managing/CreateColumnDetailedLineage.ts
  function createTarget(column, element) {
    return {
      column,
      element
    };
  }
  var ColumnDetailLineageCreator = class {
    constructor(card, column) {
      this.card = card;
      this.column = column;
    }
    render(connect, preColumnDiv) {
      const nextTargets = /* @__PURE__ */ new Map();
      const canvas = document.createElement("div");
      canvas.classList.add("lineage-column-container");
      const cardColumn = this.card.cardColumns.get(this.column.name);
      if (!cardColumn) return;
      if (cardColumn.expanded) {
        if (preColumnDiv) connect.push({ a: cardColumn.fieldItem, b: preColumnDiv });
        return;
      }
      cardColumn.fieldItem.replaceWith(canvas);
      cardColumn.fieldItem.classList.remove("hidden");
      cardColumn.canvas = canvas;
      function recurse(col, element, prevHeader, rootElement) {
        const innerCanvas = document.createElement("div");
        innerCanvas.classList.add("lineage-column-container", "full-width");
        innerCanvas.style.flexDirection = "row-reverse";
        const header = rootElement ? rootElement : document.createElement("li");
        header.textContent = col.name;
        header?.classList.add("selected");
        if (prevHeader) connect.push({ a: header, b: prevHeader });
        const childContainer = document.createElement("div");
        childContainer.classList.add("child_card_container");
        element.appendChild(innerCanvas);
        innerCanvas.appendChild(header);
        innerCanvas.appendChild(childContainer);
        if (col.refs.length === 0) {
          header.style.marginLeft = "0px";
        }
        if (col.refs.length === 0 && col.table) {
          if (nextTargets.has(col.table))
            nextTargets.get(col.table)?.add(createTarget(col.name, header));
          else {
            nextTargets.set(col.table, /* @__PURE__ */ new Set([createTarget(col.name, header)]));
          }
        } else if (col.refs.length > 0 && col.table && !rootElement) {
          header.textContent = col.table + "." + col.name;
        } else if (col.refs.length === 0 && !col.table) {
        }
        col.refs.forEach((r) => {
          recurse(r, childContainer, header);
        });
      }
      recurse(this.column, canvas, preColumnDiv, cardColumn.fieldItem);
      cardColumn.expanded = true;
      return nextTargets;
    }
  };

  // lineageViewerTS/src/managing/Card.ts
  var CardColumn = class {
    constructor(column, fieldItem = document.createElement("li")) {
      this.fieldItem = fieldItem;
      this.name = column.name;
      this.table = column.table;
      this.refs = [];
      fieldItem.className = "field-item column-item";
      fieldItem.textContent = column.name;
      fieldItem.dataset.column = column.name;
      fieldItem.title = column.table + "." + column.name;
    }
    name;
    table;
    refs;
    canvas;
    expanded = false;
  };
  var Card = class _Card {
    constructor(model, isCenter = false, direction = "left", parent = void 0, cardContainer = document.createElement("div"), card = document.createElement("div"), cardHeader = document.createElement("header"), titleSpan = document.createElement("span"), fieldButton = document.createElement("button"), fieldsContainer = document.createElement("ul"), childCards = /* @__PURE__ */ new Map()) {
      this.cardContainer = cardContainer;
      this.card = card;
      this.cardHeader = cardHeader;
      this.titleSpan = titleSpan;
      this.fieldButton = fieldButton;
      this.fieldsContainer = fieldsContainer;
      this.childCards = childCards;
      const id = Utility.generateId();
      this.id = id;
      this.direction = isCenter ? "center" : direction;
      this.parent = parent;
      this.isCenter = isCenter;
      cardContainer.className = "card_container";
      card.className = "node-card" + (isCenter ? " center" : "");
      const modelInfo = model.model;
      const name = modelInfo.name;
      this.table = name.replaceAll('"', "");
      cardContainer.dataset.card = name;
      cardContainer.dataset.id = id;
      titleSpan.textContent = name;
      _Card.card_stack.set(id, this);
      fieldButton.className = "fieldButton";
      fieldButton.dataset.card = name;
      fieldButton.dataset.id = id;
      fieldButton.textContent = "\u2261";
      cardHeader.appendChild(titleSpan);
      card.appendChild(cardHeader);
      this.columnData = modelInfo.columns ? new Map(modelInfo.columns.map((c) => [c.name, c])) : /* @__PURE__ */ new Map();
      if (modelInfo.columns) {
        cardHeader.appendChild(fieldButton);
        fieldsContainer.id = "fields-" + id;
        fieldsContainer.className = "fields-container";
        for (const field of modelInfo.columns) {
          const cardColumn = new CardColumn(field);
          this.cardColumns.set(field.name, cardColumn);
          fieldsContainer.appendChild(cardColumn.fieldItem);
        }
        card.appendChild(fieldsContainer);
      }
      const childCardContainer = document.createElement("div");
      childCardContainer.classList.add("child_card_container", direction);
      if (direction === "left") cardContainer.appendChild(childCardContainer);
      cardContainer.appendChild(card);
      if (direction === "right") cardContainer.appendChild(childCardContainer);
      model.refs?.forEach((ref) => {
        const newCard = new _Card(ref, false, direction, this);
        this.childCards.set(ref.model.name.replaceAll('"', ""), newCard);
        if (this.isCenter) {
          const leftContainer = document.getElementById("left-nodes");
          leftContainer.appendChild(newCard.cardContainer);
        } else childCardContainer.appendChild(newCard.cardContainer);
      });
      if (!this.isCenter) this.showFieldsContainer(false);
    }
    static card_stack = /* @__PURE__ */ new Map();
    parent;
    id;
    table;
    direction;
    columnData;
    cteColumnData = /* @__PURE__ */ new Map();
    isCenter = false;
    fieldsHidden = false;
    containerHidden = true;
    cardColumns = /* @__PURE__ */ new Map();
    reset() {
      const columnDivs = this.fieldsContainer.querySelectorAll(".field-item");
      columnDivs.forEach((f) => {
        f.classList.remove("selected");
      });
      this.cardColumns.forEach((cc) => {
        if (cc.canvas) {
          cc.canvas.replaceWith(cc.fieldItem);
          cc.canvas = void 0;
          cc.expanded = false;
        }
      });
    }
    toggle() {
      if (this.fieldsHidden) {
        this.showFields();
        return;
      }
      this.showFieldsContainer(!this.containerHidden);
    }
    hideFields() {
      this.fieldsHidden = true;
      const columnDivs = this.fieldsContainer.querySelectorAll(".field-item");
      columnDivs.forEach((f) => {
        if (!f.classList.contains("selected"))
          f.classList.add("hidden");
      });
      this.fieldButton.textContent = "\u{1F441}";
    }
    showFields() {
      const columnDivs = this.fieldsContainer.querySelectorAll(".field-item");
      columnDivs.forEach((f) => {
        f.classList.remove("hidden");
      });
      this.fieldButton.textContent = "\u2B06";
      this.fieldsHidden = false;
      this.showFieldsContainer(true);
    }
    showFieldsContainer(isTrue) {
      this.fieldsContainer.style.display = isTrue ? "flex" : "none";
      this.fieldButton.textContent = isTrue ? "\u2B06" : "\u2261";
      this.containerHidden = isTrue;
    }
    showFullLineage(column, connect = [], preColumnDiv) {
      this.showFieldsContainer(true);
      const cardColumn = this.columnData.get(column);
      if (cardColumn) {
        const next_targets = new ColumnDetailLineageCreator(this, cardColumn).render(connect, preColumnDiv);
        if (next_targets) {
          Array.from(next_targets.entries()).forEach((t) => {
            const child = this.childCards.get(t[0]);
            if (child) {
              t[1].forEach((ct) => {
                child.showFullLineage(ct.column, connect, ct.element);
              });
            }
          });
        }
      }
      return connect;
    }
    showLineage(column, connect = [], preColumnDiv) {
      const columnDiv = this.fieldsContainer.querySelector(`[data-column="${column}"]`);
      columnDiv?.classList.add("selected");
      if (this.isCenter) {
        this.fieldsContainer.querySelectorAll(".field-item").forEach((c) => c.classList.remove("hidden"));
      } else {
        this.hideFields();
        columnDiv?.classList.add("selected");
      }
      if (preColumnDiv && columnDiv) {
        preColumnDiv?.classList.remove("hidden");
        columnDiv?.classList.remove("hidden");
        connect.push({ a: columnDiv, b: preColumnDiv });
      }
      if (this.direction === "center" && columnDiv) {
        const traverseRightCards = (card, targetTable, targetColumn, currentColumnDiv) => {
          if (!card) return;
          if (!card.isCenter) {
            card.showFieldsContainer(true);
            card.hideFields();
            currentColumnDiv?.classList.add("selected");
          }
          const leafs = this.getLeafColumns(Array.from(card.columnData.values()));
          Array.from(leafs).filter((f) => {
            return f.table === targetTable && f.name === targetColumn;
          }).forEach((coco) => {
            const inoCa = card.cardColumns.get(coco.name);
            if (inoCa && currentColumnDiv) {
              inoCa.fieldItem.classList.add("selected");
              inoCa.fieldItem.classList.remove("hidden");
              currentColumnDiv.classList.remove("hidden");
              connect.push({ a: currentColumnDiv, b: inoCa.fieldItem });
              if (card.childCards) {
                card.childCards.forEach((innerCard) => {
                  if (innerCard.direction === "right") {
                    traverseRightCards(innerCard, card.table, coco.name, inoCa.fieldItem);
                  }
                });
              }
            }
          });
        };
        Array.from(this.childCards.values()).filter((f) => f.direction === "right").forEach((innerCard) => {
          traverseRightCards(innerCard, this.table, column, columnDiv);
        });
      }
      const columnLineages = this.columnData.get(column);
      if (columnLineages) {
        const leafColumns = this.getLeafColumns([columnLineages]);
        leafColumns.forEach((col) => {
          this.resolveLineage(col, connect, columnDiv);
        });
      }
      ;
      return connect;
    }
    getLeafColumns(columndata, cols = []) {
      columndata.forEach((cd) => {
        if (cd.refs.length === 0 && cd.table) {
          cols.push(cd);
        } else {
          this.getLeafColumns(cd.refs, cols);
        }
      });
      return cols;
    }
    resolveLineage(col, connect, columnDiv) {
      const nextColumn = col.name;
      const tableName = col.table;
      const sanitizedTableName = tableName.replaceAll('"', "");
      if (!nextColumn) return;
      const allCards = this.childCards;
      const targetCard = allCards.get(tableName) ?? allCards.get(sanitizedTableName);
      if (targetCard) {
        targetCard.showFieldsContainer(true);
        targetCard.showLineage(nextColumn, connect, columnDiv);
      }
    }
  };

  // lineageViewerTS/src/managing/lineage-zoom.ts
  var Zoomer = class _Zoomer {
    static smoothing = 0.15;
    static zoomIntensity = 1e-3;
    static instance;
    static getInstance() {
      if (!this.instance) {
        this.instance = new _Zoomer();
      }
      return this.instance;
    }
    isAnimating = false;
    translateX = 0;
    translateY = 0;
    scale = 1;
    targetTranslateX = 0;
    targetTranslateY = 0;
    targetScale = 1;
    timestamp = Date.now();
    isPanning = false;
    panStartX = 0;
    panStartY = 0;
    panActualStartX = 0;
    panActualStartY = 0;
    canvasArea = document.getElementById("canvas-area");
    canvas = document.getElementById("lineage-container");
    constructor() {
      window.addEventListener("wheel", (e) => {
        this.handleWheel(e);
      }, { passive: false });
      window.addEventListener("mousedown", (e) => {
        this.handleMouseDown(e);
      });
      window.addEventListener("mousemove", (e) => {
        this.handleMouseMove(e);
      });
      window.addEventListener("mouseup", (e) => {
        this.handleMouseUp(e);
      });
    }
    handleMouseDown(e) {
      this.isPanning = true;
      this.panStartX = e.clientX;
      this.panStartY = e.clientY;
      this.panActualStartX = e.clientX;
      this.panActualStartY = e.clientY;
      this.canvas.style.cursor = "grabbing";
    }
    handleMouseMove(e) {
      if (this.isPanning) {
        if (this.isAnimating) this.isAnimating = false;
        const dx = e.clientX - this.panStartX;
        const dy = e.clientY - this.panStartY;
        this.translateX += dx;
        this.translateY += dy;
        this.targetTranslateX = this.translateX;
        this.targetTranslateY = this.translateY;
        this.panStartX = e.clientX;
        this.panStartY = e.clientY;
        this.updateTransform();
      }
    }
    handleMouseUp(e) {
      if (this.isPanning) {
        this.isPanning = false;
        this.canvas.style.cursor = "default";
        const dx = e.clientX - this.panActualStartX;
        const dy = e.clientY - this.panActualStartY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const threshold = 10;
        if (distance > threshold) {
          return;
        }
      }
    }
    handleWheel(e) {
      e.preventDefault();
      if (e.shiftKey) {
        const panAmount = e.deltaY;
        if (!this.isAnimating) {
          this.translateX -= panAmount;
          this.targetTranslateX = this.translateX;
          this.updateTransform();
        } else {
          this.targetTranslateX -= panAmount;
        }
        return;
      }
      if (e.ctrlKey) {
        const panAmount = e.deltaY;
        if (!this.isAnimating) {
          this.translateY -= panAmount;
          this.targetTranslateY = this.translateY;
          this.updateTransform();
        } else {
          this.targetTranslateY -= panAmount;
        }
        return;
      }
      const scrollDelta = -e.deltaY;
      if (!this.isAnimating) this.targetScale = this.scale;
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const worldMouseX = (mouseX - this.translateX) / this.scale;
      const worldMouseY = (mouseY - this.translateY) / this.scale;
      const newTargetScale = this.targetScale * Math.exp(scrollDelta * _Zoomer.zoomIntensity);
      this.targetScale = Math.max(0.2, Math.min(3, newTargetScale));
      this.targetTranslateX = mouseX - worldMouseX * this.targetScale;
      this.targetTranslateY = mouseY - worldMouseY * this.targetScale;
      if (!this.isAnimating) {
        this.isAnimating = true;
        requestAnimationFrame(() => this.animateZoom());
      }
    }
    animateZoom() {
      if (!this.isAnimating) return;
      this.scale += (this.targetScale - this.scale) * _Zoomer.smoothing;
      this.translateX += (this.targetTranslateX - this.translateX) * _Zoomer.smoothing;
      this.translateY += (this.targetTranslateY - this.translateY) * _Zoomer.smoothing;
      this.updateTransform();
      const scaleDiff = Math.abs(this.targetScale - this.scale);
      const txDiff = Math.abs(this.targetTranslateX - this.translateX);
      const tyDiff = Math.abs(this.targetTranslateY - this.translateY);
      if (scaleDiff < 1e-3 && txDiff < 1e-3 && tyDiff < 1e-3) {
        this.scale = this.targetScale;
        this.translateX = this.targetTranslateX;
        this.translateY = this.targetTranslateY;
        this.isAnimating = false;
      } else {
        requestAnimationFrame(() => this.animateZoom());
      }
    }
    updateTransform() {
      this.update(this.scale, this.translateX, this.translateY);
      this.canvas.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
      const bgSpacing = 50 * this.scale;
      this.canvasArea.style.backgroundSize = `100% ${bgSpacing}%`;
    }
    update(scale, tx, ty) {
      this.scale = scale;
      this.translateX = tx;
      this.translateY = ty;
      this.scale = scale;
      this.translateX = tx;
      this.translateY = ty;
      this.timestamp = Date.now();
    }
  };

  // lineageViewerTS/src/managing/LineageManager.ts
  var LineageManager = class _LineageManager {
    centerCard;
    svg;
    connections = [];
    constructor() {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.classList.add("svg");
      const canvasArea = document.getElementById("canvas-area");
      const lineageArea = document.getElementById("lineage-container");
      lineageArea.appendChild(this.svg);
    }
    initData(data) {
      const centerContainer = document.getElementById("center-nodes");
      const rightContainer = document.getElementById("right-nodes");
      Card.card_stack.clear();
      const centerCard = new Card(data.centerModel, true);
      this.centerCard = centerCard;
      centerContainer.appendChild(centerCard.cardContainer);
      if (data.rightRefs && data.rightRefs.length > 0) {
        data.rightRefs.forEach((ref) => {
          const rightCard = new Card(ref, false, "right", centerCard);
          centerCard.childCards.set(rightCard.id, rightCard);
          rightContainer.appendChild(rightCard.cardContainer);
        });
      } else {
        rightContainer.innerHTML = '<div class="empty-state">None</div>';
      }
    }
    showLineageOnCard(cardId, column, detailed = false) {
      const focusCard = Card.card_stack.get(cardId);
      if (focusCard && focusCard.isCenter) {
        document.querySelectorAll(".field-item").forEach((c) => {
          c.classList.remove("selected");
        });
        Card.card_stack.forEach((card) => {
          card.reset();
          if (card !== this.centerCard) card.showFieldsContainer(false);
        });
        const connections = detailed ? focusCard?.showFullLineage(column, [], null) : focusCard?.showLineage(column, [], null);
        this.connections = connections;
        this.paintConnections(connections);
      }
    }
    clearPaths() {
      this.svg.replaceChildren();
    }
    repaint() {
      this.paintConnections(this.connections);
    }
    paintConnections(connections) {
      this.svg.replaceChildren();
      const svgRect = this.svg.getBoundingClientRect();
      const zoomer2 = Zoomer.getInstance();
      const scale = zoomer2.scale || 1;
      connections.forEach((con) => {
        const rectA = con.a.getBoundingClientRect();
        const rectB = con.b.getBoundingClientRect();
        const fromX = (rectA.right - svgRect.left) / scale;
        const fromY = (rectA.top + rectA.height / 2 - svgRect.top) / scale;
        const toX = (rectB.left - svgRect.left) / scale;
        const toY = (rectB.top + rectB.height / 2 - svgRect.top) / scale;
        const pathData = _LineageManager.createHorizontalCurvedPathCooooler(fromX, fromY, toX, toY);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("stroke-width", String(2 / scale));
        path.setAttribute("fill", "none");
        this.svg.appendChild(path);
      });
    }
    static createHorizontalCurvedPath(fromX, fromY, toX, toY) {
      if (toX < fromX) {
        [fromX, toX] = [toX, fromX];
        [fromY, toY] = [toY, fromY];
      }
      const desiredOffset = 0;
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1) return `M ${fromX},${fromY}`;
      const offset = Math.min(desiredOffset, distance / 2);
      const startX = fromX + deltaX / distance * offset;
      const startY = fromY + deltaY / distance * offset;
      const endX = toX - deltaX / distance * offset;
      const endY = toY - deltaY / distance * offset;
      const dy = Math.abs(endY - startY);
      const lerped = Math.max(Math.min((dy - 100) / 400, 1), 0);
      const dx = Math.abs(endX - startX);
      const baseCurve = 400;
      const minCurve = 20;
      const curve = Math.max(baseCurve / ((dx - 50) / 250 + 1), minCurve) * lerped;
      return `M ${startX},${startY} C ${startX + curve},${startY} ${endX - curve},${endY} ${endX},${endY}`;
    }
    static createHorizontalCurvedPathEasy(fromX, fromY, toX, toY) {
      if (toX < fromX) {
        [fromX, toX] = [toX, fromX];
        [fromY, toY] = [toY, fromY];
      }
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1) return `M ${fromX},${fromY}`;
      const curve = Math.min(Math.max(deltaX * 0.1, 30), 150);
      return `M ${fromX},${fromY} C ${fromX + curve},${fromY} ${toX - curve},${toY} ${toX},${toY}`;
    }
    static createHorizontalCurvedPathThree(fromX, fromY, toX, toY) {
      if (toX < fromX) {
        [fromX, toX] = [toX, fromX];
        [fromY, toY] = [toY, fromY];
      }
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const distanceY = Math.sqrt(deltaY * deltaY);
      if (distance < 1) return `M ${fromX},${fromY}`;
      const curve = Math.min(Math.max(deltaX * 0.35, 30), 150);
      const ctrl1X = fromX + curve * 2;
      const ctrl1Y = fromY;
      const ctrl2X = toX - curve;
      const ctrl2Y = toY;
      return `M ${fromX},${fromY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${toX},${toY}`;
    }
    static createHorizontalCurvedPathCool(fromX, fromY, toX, toY) {
      if (toX < fromX) {
        [fromX, toX] = [toX, fromX];
        [fromY, toY] = [toY, fromY];
      }
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1) return `M ${fromX},${fromY}`;
      const curve = Math.min(Math.max(deltaX * 0.35, 30), 150);
      const ctrl1X = fromX + curve * 0.2;
      const ctrl1Y = fromY;
      const ctrl2X = toX;
      let ctrl2Y = toY;
      const diffY = toY - fromY;
      const threshold = 10;
      if (Math.abs(diffY) <= threshold) {
        return `M ${fromX},${fromY} L ${toX},${toY}`;
      }
      if (Math.abs(diffY) <= threshold) {
        ctrl2Y = toY;
      } else if (diffY > 0) {
        ctrl2Y = toY - curve;
      } else {
        ctrl2Y = toY + curve;
      }
      return `M ${fromX},${fromY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${toX},${toY}`;
    }
    static createHorizontalCurvedPathCooooler(fromX, fromY, toX, toY) {
      if (toX < fromX) {
        [fromX, toX] = [toX, fromX];
        [fromY, toY] = [toY, fromY];
      }
      const deltaX = toX - fromX;
      const deltaY = toY - fromY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance < 1) return `M ${fromX},${fromY}`;
      const curve = Math.min(Math.max(deltaX * 0.35, 30), 150);
      const ctrl1X = fromX + curve * 0.2;
      const ctrl1Y = fromY;
      const diffY = toY - fromY;
      const threshold = 10;
      let ctrl2X = toX;
      let ctrl2Y = toY;
      if (Math.abs(diffY) <= threshold) {
        return `M ${fromX},${fromY} L ${toX},${toY}`;
        ctrl2X = toX - curve;
        ctrl2Y = toY;
      } else {
        const verticalSign = diffY > 0 ? -1 : 1;
        ctrl2Y = toY + curve * 0.8 * verticalSign;
        ctrl2X = toX - curve * 0.2;
      }
      return `M ${fromX},${fromY} C ${ctrl1X},${ctrl1Y} ${ctrl2X},${ctrl2Y} ${toX},${toY}`;
    }
  };

  // lineageViewerTS/src/managing/lineage.ts
  var vscode = getVsCodeApi();
  window.addEventListener("message", (event) => {
    const message = event.data;
    if (message.command === "renderLineage") {
      renderLineage(message.data);
    }
  });
  var lineageManager = new LineageManager();
  var zoomer = Zoomer.getInstance();
  var eventListener = (e) => {
    if (!(e.target instanceof HTMLElement)) return;
    const changeSizeButton = e.target?.closest("button[data-action]");
    if (changeSizeButton instanceof HTMLElement) {
      e.stopPropagation();
      const action = changeSizeButton.dataset.action;
      if (action === "left-decrease" || action === "left-increase") {
        const sizeLabel = document.getElementById("left-lineage-size-label");
        let currentSize = Number(sizeLabel.textContent);
        if (currentSize > 1 && action === "left-decrease") currentSize = currentSize - 1;
        else if (currentSize < 12 && action === "left-increase") currentSize = currentSize + 1;
        sizeLabel.textContent = currentSize + "";
        post(action);
      }
      if (action === "right-decrease" || action === "right-increase") {
        const sizeLabel = document.getElementById("right-lineage-size-label");
        let currentSize = Number(sizeLabel.textContent);
        if (currentSize > 1 && action === "right-decrease") currentSize = currentSize - 1;
        else if (currentSize < 12 && action === "right-increase") currentSize = currentSize + 1;
        sizeLabel.textContent = currentSize + "";
        post(action);
      }
      return;
    }
    const button = e.target.closest(".fieldButton");
    if (button instanceof HTMLElement) {
      e.stopPropagation();
      const card2 = Card.card_stack.get(button.dataset.id ?? "");
      if (card2) {
        card2.toggle();
        lineageManager.repaint();
      }
      return;
    }
    const columnItem = e.target.closest(".column-item");
    if (columnItem instanceof HTMLElement) {
      const cardContainer = e.target.closest(".card_container");
      const column = columnItem.dataset.column;
      lineageManager.showLineageOnCard(cardContainer?.dataset.id, column, e.ctrlKey);
      return;
    }
    const card = e.target.closest(".node-card");
    if (card) {
      const headerSpan = card.querySelector("header span");
      if (headerSpan?.textContent) {
        post("browse", headerSpan.textContent);
        return;
      }
    }
  };
  function post(command, ...args) {
    lineageManager.clearPaths();
    vscode?.postMessage({
      command,
      args
    });
  }
  function renderLineage(data) {
    const leftContainer = document.getElementById("left-nodes");
    const centerContainer = document.getElementById("center-nodes");
    const rightContainer = document.getElementById("right-nodes");
    const leftSizeLabel = document.getElementById("left-lineage-size-label");
    leftSizeLabel.textContent = data.size_left;
    const rightSizeLabel = document.getElementById("right-lineage-size-label");
    rightSizeLabel.textContent = data.size_right;
    document.removeEventListener("click", eventListener);
    document.addEventListener("click", eventListener);
    leftContainer.innerHTML = "";
    centerContainer.innerHTML = "";
    rightContainer.innerHTML = "";
    lineageManager.initData(data);
  }
  document.removeEventListener("click", eventListener);
  document.addEventListener("click", eventListener);

  // lineageViewerTS/src/test_data/test_data.ts
  var testData = {
    "centerModel": {
      "model": {
        "collapsibleState": 1,
        "label": '"holdings_recent_change"',
        "name": '"holdings_recent_change"',
        "file_name": "holdings_recent_changes.sql",
        "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\holdings_recent_changes.sql",
        "table_names": [
          "recent_holdings_filter_weekends"
        ],
        "columns": [
          {
            "name": "profitpercent",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "profitpercent",
                "table": "recent_holdings_filter_weekends",
                "refs": []
              }
            ]
          },
          {
            "name": "name",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "name",
                "table": "recent_holdings_filter_weekends",
                "refs": []
              }
            ]
          },
          {
            "name": "orderbookid",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "orderbookid",
                "table": "recent_holdings_filter_weekends",
                "refs": []
              }
            ]
          },
          {
            "name": "lag_profitpercent",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "window",
                "refs": [
                  {
                    "name": "lag",
                    "refs": [
                      {
                        "name": "profitpercent",
                        "table": "recent_holdings_filter_weekends",
                        "refs": []
                      },
                      {
                        "name": "neg",
                        "refs": [
                          {
                            "name": "literal:1",
                            "refs": []
                          }
                        ]
                      },
                      {
                        "name": "null",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "orderbookid",
                    "table": "recent_holdings_filter_weekends",
                    "refs": []
                  },
                  {
                    "name": "order",
                    "refs": [
                      {
                        "name": "ordered",
                        "refs": [
                          {
                            "name": "date",
                            "table": "recent_holdings_filter_weekends",
                            "refs": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "lag_time",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "window",
                "refs": [
                  {
                    "name": "lag",
                    "refs": [
                      {
                        "name": "date",
                        "table": "recent_holdings_filter_weekends",
                        "refs": []
                      },
                      {
                        "name": "neg",
                        "refs": [
                          {
                            "name": "literal:1",
                            "refs": []
                          }
                        ]
                      },
                      {
                        "name": "null",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "orderbookid",
                    "table": "recent_holdings_filter_weekends",
                    "refs": []
                  },
                  {
                    "name": "order",
                    "refs": [
                      {
                        "name": "ordered",
                        "refs": [
                          {
                            "name": "date",
                            "table": "recent_holdings_filter_weekends",
                            "refs": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "lag_2_profitpercent",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "window",
                "refs": [
                  {
                    "name": "lag",
                    "refs": [
                      {
                        "name": "profitpercent",
                        "table": "recent_holdings_filter_weekends",
                        "refs": []
                      },
                      {
                        "name": "neg",
                        "refs": [
                          {
                            "name": "literal:2",
                            "refs": []
                          }
                        ]
                      },
                      {
                        "name": "null",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "orderbookid",
                    "table": "recent_holdings_filter_weekends",
                    "refs": []
                  },
                  {
                    "name": "order",
                    "refs": [
                      {
                        "name": "ordered",
                        "refs": [
                          {
                            "name": "date",
                            "table": "recent_holdings_filter_weekends",
                            "refs": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "lag_2_time",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "window",
                "refs": [
                  {
                    "name": "lag",
                    "refs": [
                      {
                        "name": "date",
                        "table": "recent_holdings_filter_weekends",
                        "refs": []
                      },
                      {
                        "name": "neg",
                        "refs": [
                          {
                            "name": "literal:2",
                            "refs": []
                          }
                        ]
                      },
                      {
                        "name": "null",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "orderbookid",
                    "table": "recent_holdings_filter_weekends",
                    "refs": []
                  },
                  {
                    "name": "order",
                    "refs": [
                      {
                        "name": "ordered",
                        "refs": [
                          {
                            "name": "date",
                            "table": "recent_holdings_filter_weekends",
                            "refs": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "rn",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "window",
                "refs": [
                  {
                    "name": "rownumber",
                    "refs": []
                  },
                  {
                    "name": "orderbookid",
                    "table": "recent_holdings_filter_weekends",
                    "refs": []
                  },
                  {
                    "name": "order",
                    "refs": [
                      {
                        "name": "ordered",
                        "refs": [
                          {
                            "name": "date",
                            "table": "recent_holdings_filter_weekends",
                            "refs": []
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "latest_time",
            "table": '"holdings_recent_change"',
            "refs": [
              {
                "name": "date",
                "table": "recent_holdings_filter_weekends",
                "refs": []
              }
            ]
          }
        ],
        "command": {
          "command": "sql-nav-link.openPath",
          "title": '"holdings_recent_change"',
          "arguments": [
            "e:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\holdings_recent_changes.sql"
          ]
        }
      },
      "refs": [
        {
          "model": {
            "collapsibleState": 1,
            "label": '"recent_holdings_filter_weekends"',
            "name": '"recent_holdings_filter_weekends"',
            "file_name": "recent_holdings_filter_weekends.sql",
            "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\recent_holdings_filter_weekends.sql",
            "table_names": [
              "recent_holdings"
            ],
            "columns": [
              {
                "name": "accountid",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "accountid",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "accountname",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "accountname",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "volume",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "volume",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "value",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "value",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "acquiredvalue",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "acquiredvalue",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "averageacquiredprice",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "averageacquiredprice",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "averageacquiredpriceinstrumentcurrency",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "averageacquiredpriceinstrumentcurrency",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "profit",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "profit",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "profitpercent",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "profitpercent",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "instrumentid",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "instrumentid",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "name",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "name",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "isin",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "isin",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "tickersymbol",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "tickersymbol",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "currency",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "currency",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "orderbookid",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "orderbookid",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "type",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "type",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "lastprice",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "lastprice",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "change",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "change",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "changepercent",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "changepercent",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "dayhighestprice",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "dayhighestprice",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "daylowestprice",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "daylowestprice",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              },
              {
                "name": "date",
                "table": '"recent_holdings_filter_weekends"',
                "refs": [
                  {
                    "name": "date",
                    "table": "recent_holdings",
                    "refs": []
                  }
                ]
              }
            ],
            "command": {
              "command": "sql-nav-link.openPath",
              "title": '"recent_holdings_filter_weekends"',
              "arguments": [
                "e:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\recent_holdings_filter_weekends.sql"
              ]
            }
          },
          "refs": [
            {
              "model": {
                "collapsibleState": 1,
                "label": '"recent_holdings"',
                "name": '"recent_holdings"',
                "file_name": "recent_holdings.sql",
                "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql",
                "table_names": [
                  "public.postgres.holdings"
                ],
                "columns": [
                  {
                    "name": "accountid",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "accountid",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "accountname",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "accountname",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "volume",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "volume",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "value",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "value",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "acquiredvalue",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "acquiredvalue",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "averageacquiredprice",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "averageacquiredprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "averageacquiredpriceinstrumentcurrency",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "averageacquiredpriceinstrumentcurrency",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "profit",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "profit",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "profitpercent",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "profitpercent",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "instrumentid",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "instrumentid",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "name",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "name",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "isin",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "isin",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "tickersymbol",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "tickersymbol",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "currency",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "currency",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "orderbookid",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "orderbookid",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "type",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "type",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "lastprice",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "lastprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "change",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "change",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "changepercent",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "changepercent",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "dayhighestprice",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "dayhighestprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "daylowestprice",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "daylowestprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  {
                    "name": "date",
                    "table": '"recent_holdings"',
                    "refs": [
                      {
                        "name": "unixtotime",
                        "refs": [
                          {
                            "name": "date",
                            "table": "public.postgres.holdings",
                            "refs": []
                          }
                        ]
                      }
                    ]
                  }
                ],
                "command": {
                  "command": "sql-nav-link.openPath",
                  "title": '"recent_holdings"',
                  "arguments": [
                    "e:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_holdings.sql"
                  ]
                }
              },
              "refs": [
                {
                  "model": {
                    "name": "public.postgres.holdings",
                    "file_name": "",
                    "file_path": "",
                    "table_names": [],
                    "columns": [
                      {
                        "name": "accountid",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "accountname",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "volume",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "value",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "acquiredvalue",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "averageacquiredprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "averageacquiredpriceinstrumentcurrency",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "profit",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "profitpercent",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "instrumentid",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "name",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "isin",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "tickersymbol",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "currency",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "orderbookid",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "type",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "lastprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "change",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "changepercent",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "dayhighestprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "daylowestprice",
                        "table": "public.postgres.holdings",
                        "refs": []
                      },
                      {
                        "name": "date",
                        "table": "public.postgres.holdings",
                        "refs": []
                      }
                    ]
                  },
                  "refs": [],
                  "fields": [
                    "accountid",
                    "accountname",
                    "volume",
                    "value",
                    "acquiredvalue",
                    "averageacquiredprice",
                    "averageacquiredpriceinstrumentcurrency",
                    "profit",
                    "profitpercent",
                    "instrumentid",
                    "name",
                    "isin",
                    "tickersymbol",
                    "currency",
                    "orderbookid",
                    "type",
                    "lastprice",
                    "change",
                    "changepercent",
                    "dayhighestprice",
                    "daylowestprice",
                    "date"
                  ]
                }
              ],
              "fields": [
                "accountid",
                "accountname",
                "volume",
                "value",
                "acquiredvalue",
                "averageacquiredprice",
                "averageacquiredpriceinstrumentcurrency",
                "profit",
                "profitpercent",
                "instrumentid",
                "name",
                "isin",
                "tickersymbol",
                "currency",
                "orderbookid",
                "type",
                "lastprice",
                "change",
                "changepercent",
                "dayhighestprice",
                "daylowestprice",
                "date"
              ]
            }
          ],
          "fields": [
            "accountid",
            "accountname",
            "volume",
            "value",
            "acquiredvalue",
            "averageacquiredprice",
            "averageacquiredpriceinstrumentcurrency",
            "profit",
            "profitpercent",
            "instrumentid",
            "name",
            "isin",
            "tickersymbol",
            "currency",
            "orderbookid",
            "type",
            "lastprice",
            "change",
            "changepercent",
            "dayhighestprice",
            "daylowestprice",
            "date"
          ]
        }
      ]
    },
    "rightRefs": [
      {
        "model": {
          "collapsibleState": 1,
          "label": '"holdings_latest_difference"',
          "name": '"holdings_latest_difference"',
          "file_name": "holdings_latest_difference.sql",
          "file_path": "e:\\Uibi\\sqlmesh\\project_one\\models\\20_transform\\holdings_latest_difference.sql",
          "table_names": [
            "holdings_recent_change"
          ],
          "columns": [
            {
              "name": "name",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "name",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "orderbookid",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "orderbookid",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "lag_2_profitpercent",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "lag_2_profitpercent",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "lag_profitpercent",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "lag_profitpercent",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "profitpercent",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "profitpercent",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "lag_2_time",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "lag_2_time",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "lag_time",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "lag_time",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "latest_time",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "latest_time",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "rn",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "rn",
                  "table": "holdings_recent_change",
                  "refs": []
                }
              ]
            },
            {
              "name": "minute_difference",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "extract",
                  "refs": [
                    {
                      "name": "literal:MINUTE",
                      "refs": []
                    },
                    {
                      "name": "sub",
                      "refs": [
                        {
                          "name": "latest_time",
                          "table": "holdings_recent_change",
                          "refs": []
                        },
                        {
                          "name": "lag_time",
                          "table": "holdings_recent_change",
                          "refs": []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "minute_difference_2",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "extract",
                  "refs": [
                    {
                      "name": "literal:MINUTE",
                      "refs": []
                    },
                    {
                      "name": "sub",
                      "refs": [
                        {
                          "name": "lag_time",
                          "table": "holdings_recent_change",
                          "refs": []
                        },
                        {
                          "name": "lag_2_time",
                          "table": "holdings_recent_change",
                          "refs": []
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "name": "latest_diff",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "round",
                  "refs": [
                    {
                      "name": "cast",
                      "refs": [
                        {
                          "name": "sub",
                          "refs": [
                            {
                              "name": "profitpercent",
                              "table": "holdings_recent_change",
                              "refs": []
                            },
                            {
                              "name": "lag_profitpercent",
                              "table": "holdings_recent_change",
                              "refs": []
                            }
                          ]
                        },
                        {
                          "name": "DECIMAL",
                          "refs": []
                        }
                      ]
                    },
                    {
                      "name": "literal:2",
                      "refs": []
                    }
                  ]
                }
              ]
            },
            {
              "name": "latest_2_diff",
              "table": '"holdings_latest_difference"',
              "refs": [
                {
                  "name": "round",
                  "refs": [
                    {
                      "name": "cast",
                      "refs": [
                        {
                          "name": "sub",
                          "refs": [
                            {
                              "name": "lag_profitpercent",
                              "table": "holdings_recent_change",
                              "refs": []
                            },
                            {
                              "name": "lag_2_profitpercent",
                              "table": "holdings_recent_change",
                              "refs": []
                            }
                          ]
                        },
                        {
                          "name": "DECIMAL",
                          "refs": []
                        }
                      ]
                    },
                    {
                      "name": "literal:2",
                      "refs": []
                    }
                  ]
                }
              ]
            }
          ],
          "command": {
            "command": "sql-nav-link.openPath",
            "title": '"holdings_latest_difference"',
            "arguments": [
              "e:\\Uibi\\sqlmesh\\project_one\\models\\20_transform\\holdings_latest_difference.sql"
            ]
          }
        },
        "refs": [],
        "fields": [
          "profitpercent",
          "name",
          "orderbookid",
          "lag_profitpercent",
          "lag_time",
          "lag_2_profitpercent",
          "lag_2_time",
          "rn",
          "latest_time"
        ]
      }
    ],
    "size_left": "3",
    "size_right": "2"
  };

  // lineageViewerTS/src/main.ts
  var vscode2 = getVsCodeApi();
  document.addEventListener("DOMContentLoaded", () => {
    renderLineage(testData);
  });
})();
//# sourceMappingURL=index.js.map
