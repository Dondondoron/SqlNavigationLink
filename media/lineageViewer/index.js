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
    fieldItem;
    name;
    table;
    refs;
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
      this.table = name;
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
        this.childCards.set(ref.model.name, newCard);
        if (this.isCenter) {
          const leftContainer = document.getElementById("left-nodes");
          leftContainer.appendChild(newCard.cardContainer);
        } else childCardContainer.appendChild(newCard.cardContainer);
      });
      if (!this.isCenter) this.showFieldsContainer(false);
    }
    cardContainer;
    card;
    cardHeader;
    titleSpan;
    fieldButton;
    fieldsContainer;
    childCards;
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
          Array.from(card.columnData.values()).filter((f) => f.refs.some((c) => c.table === targetTable && c.name === targetColumn)).forEach((coco) => {
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
      columnLineages?.refs.forEach((col) => {
        this.resolveLineage(col, connect, columnDiv);
      });
      return connect;
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
    showLineageOnCard(cardId, column) {
      const focusCard = Card.card_stack.get(cardId);
      if (focusCard && focusCard.isCenter) {
        document.querySelectorAll(".field-item").forEach((c) => {
          c.classList.remove("selected");
        });
        Card.card_stack.forEach((card) => {
          card.reset();
          if (card !== this.centerCard) card.showFieldsContainer(false);
        });
        const connections = focusCard?.showLineage(column, [], null);
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
        const pathData = _LineageManager.createHorizontalCurvedPath(fromX, fromY, toX, toY);
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
      lineageManager.showLineageOnCard(cardContainer?.dataset.id, column);
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
  var testDataReverse = {
    "centerModel": {
      "model": {
        "collapsibleState": 1,
        "label": "recent_prices",
        "name": "recent_prices",
        "file_name": "recent_prices.sql",
        "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql",
        "table_names": [
          "bors_prices"
        ],
        "columns": [
          {
            "name": "trade_date",
            "table": "recent_prices",
            "refs": [
              {
                "name": "trade_date",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          {
            "name": "ins_id",
            "table": "recent_prices",
            "refs": [
              {
                "name": "ins_id",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          {
            "name": "high_price",
            "table": "recent_prices",
            "refs": [
              {
                "name": "high_price",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          {
            "name": "low_price",
            "table": "recent_prices",
            "refs": [
              {
                "name": "low_price",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          {
            "name": "open_price",
            "table": "recent_prices",
            "refs": [
              {
                "name": "open_price",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          {
            "name": "close_price",
            "table": "recent_prices",
            "refs": [
              {
                "name": "close_price",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          {
            "name": "volume",
            "table": "recent_prices",
            "refs": [
              {
                "name": "volume",
                "table": "bors_prices",
                "refs": []
              }
            ]
          }
        ],
        "command": {
          "command": "sql-nav-link.openPath",
          "title": "recent_prices",
          "arguments": [
            "E:\\Uibi\\sqlmesh\\project_one\\models\\00_mock\\recent_prices.sql"
          ]
        }
      },
      "refs": [
        {
          "model": {
            "name": "bors_prices",
            "file_name": "",
            "file_path": "",
            "table_names": [],
            "columns": [
              {
                "name": "trade_date",
                "table": "bors_prices",
                "refs": []
              },
              {
                "name": "ins_id",
                "table": "bors_prices",
                "refs": []
              },
              {
                "name": "high_price",
                "table": "bors_prices",
                "refs": []
              },
              {
                "name": "low_price",
                "table": "bors_prices",
                "refs": []
              },
              {
                "name": "open_price",
                "table": "bors_prices",
                "refs": []
              },
              {
                "name": "close_price",
                "table": "bors_prices",
                "refs": []
              },
              {
                "name": "volume",
                "table": "bors_prices",
                "refs": []
              }
            ]
          },
          "refs": [],
          "fields": []
        }
      ]
    },
    "rightRefs": [
      {
        "model": {
          "collapsibleState": 1,
          "label": "last_two_week_prices",
          "name": "last_two_week_prices",
          "file_name": "last_two_week_prices.sql",
          "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql",
          "table_names": [
            "recent_prices"
          ],
          "columns": [
            {
              "name": "ins_id",
              "table": "last_two_week_prices",
              "refs": [
                {
                  "name": "ins_id",
                  "table": "recent_prices",
                  "refs": []
                }
              ]
            },
            {
              "name": "price_data",
              "table": "last_two_week_prices",
              "refs": [
                {
                  "name": "high_price",
                  "table": "recent_prices",
                  "refs": []
                },
                {
                  "name": "open_price",
                  "table": "recent_prices",
                  "refs": []
                },
                {
                  "name": "close_price",
                  "table": "recent_prices",
                  "refs": []
                },
                {
                  "name": "trade_date",
                  "table": "recent_prices",
                  "refs": []
                },
                {
                  "name": "low_price",
                  "table": "recent_prices",
                  "refs": []
                }
              ]
            }
          ],
          "command": {
            "command": "sql-nav-link.openPath",
            "title": "last_two_week_prices",
            "arguments": [
              "E:\\Uibi\\sqlmesh\\project_one\\models\\05_external\\last_two_week_prices.sql"
            ]
          }
        },
        "refs": [
          {
            "model": {
              "collapsibleState": 1,
              "label": "group_day_holding_with_bors",
              "name": "group_day_holding_with_bors",
              "file_name": "group_day_holding_with_bors.sql",
              "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql",
              "table_names": [
                "bors_info",
                "group_holding_day",
                "last_two_week_prices"
              ],
              "columns": [
                {
                  "name": "averageacquiredprice",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "averageacquiredprice",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "instrumentid",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "instrumentid",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "name",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "name",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "tickersymbol",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "tickersymbol",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "orderbookid",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "orderbookid",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "prices_on_date",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "prices_on_date",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "type",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "type",
                      "table": "group_holding_day",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "instid",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "instid",
                      "table": "bors_info",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "price_data",
                  "table": "group_day_holding_with_bors",
                  "refs": [
                    {
                      "name": "price_data",
                      "table": "last_two_week_prices",
                      "refs": []
                    },
                    {
                      "name": "p_entry",
                      "table": "ghp",
                      "refs": []
                    },
                    {
                      "name": "day_data",
                      "table": "ghp",
                      "refs": []
                    }
                  ]
                }
              ],
              "command": {
                "command": "sql-nav-link.openPath",
                "title": "group_day_holding_with_bors",
                "arguments": [
                  "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\group_day_holding_with_bors.sql"
                ]
              }
            },
            "refs": [],
            "fields": []
          },
          {
            "model": {
              "collapsibleState": 1,
              "label": "last_two_week_holdings",
              "name": "last_two_week_holdings",
              "file_name": "last_two_week_holdings.sql",
              "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\last_two_week_holdings.sql",
              "table_names": [
                "bors_info",
                "grouped_holdings",
                "last_two_week_prices"
              ],
              "columns": [
                {
                  "name": "instrumentid",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "instrumentid",
                      "table": "grouped_holdings",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "orderbookid",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "orderbookid",
                      "table": "grouped_holdings",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "name",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "name",
                      "table": "grouped_holdings",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "tickersymbol",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "tickersymbol",
                      "table": "grouped_holdings",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "type",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "type",
                      "table": "grouped_holdings",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "averageacquiredprice",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "averageacquiredprice",
                      "table": "grouped_holdings",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "ins_id",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "ins_id",
                      "table": "last_two_week_prices",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "price_data",
                  "table": "last_two_week_holdings",
                  "refs": [
                    {
                      "name": "price_data",
                      "table": "last_two_week_prices",
                      "refs": []
                    }
                  ]
                }
              ],
              "command": {
                "command": "sql-nav-link.openPath",
                "title": "last_two_week_holdings",
                "arguments": [
                  "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\last_two_week_holdings.sql"
                ]
              }
            },
            "refs": [],
            "fields": []
          },
          {
            "model": {
              "collapsibleState": 1,
              "label": "reddit_trending_with_prices",
              "name": "reddit_trending_with_prices",
              "file_name": "reddit_trending_with_prices.sql",
              "file_path": "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql",
              "table_names": [
                "reddit_seven_day_trending_two",
                "reddit_seven_day_trending",
                "last_two_week_prices"
              ],
              "columns": [
                {
                  "name": "count",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "COUNT",
                      "table": "reddit_seven_day_trending_two",
                      "refs": []
                    },
                    {
                      "name": "COUNT",
                      "table": "reddit_seven_day_trending",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "JSON_AGG",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "JSON_AGG",
                      "table": "reddit_seven_day_trending_two",
                      "refs": []
                    },
                    {
                      "name": "JSON_AGG",
                      "table": "reddit_seven_day_trending",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "instid",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "instid",
                      "table": "reddit_seven_day_trending_two",
                      "refs": []
                    },
                    {
                      "name": "instid",
                      "table": "reddit_seven_day_trending",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "orderbookid",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "orderbookid",
                      "table": "reddit_seven_day_trending_two",
                      "refs": []
                    },
                    {
                      "name": "orderbookid",
                      "table": "reddit_seven_day_trending",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "tickersymbol",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "tickersymbol",
                      "table": "reddit_seven_day_trending_two",
                      "refs": []
                    },
                    {
                      "name": "tickersymbol",
                      "table": "reddit_seven_day_trending",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "name",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "name",
                      "table": "reddit_seven_day_trending_two",
                      "refs": []
                    },
                    {
                      "name": "name",
                      "table": "reddit_seven_day_trending",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "status",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "status",
                      "table": "",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "price_data",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "price_data",
                      "table": "last_two_week_prices",
                      "refs": []
                    }
                  ]
                },
                {
                  "name": "last_update_time",
                  "table": "reddit_trending_with_prices",
                  "refs": [
                    {
                      "name": "last_update_time",
                      "table": "",
                      "refs": []
                    }
                  ]
                }
              ],
              "command": {
                "command": "sql-nav-link.openPath",
                "title": "reddit_trending_with_prices",
                "arguments": [
                  "E:\\Uibi\\sqlmesh\\project_one\\models\\10_open\\reddit_trending_with_prices.sql"
                ]
              }
            },
            "refs": [],
            "fields": []
          }
        ],
        "fields": [
          "trade_date",
          "ins_id",
          "high_price",
          "low_price",
          "open_price",
          "close_price",
          "volume"
        ]
      }
    ],
    "size_left": "3",
    "size_right": "3"
  };

  // lineageViewerTS/src/main.ts
  var vscode2 = getVsCodeApi();
  document.addEventListener("DOMContentLoaded", () => {
    renderLineage(testDataReverse);
  });
})();
//# sourceMappingURL=index.js.map
