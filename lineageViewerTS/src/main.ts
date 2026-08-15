// lineageViewerTS/src/main.ts

// 1. Import styles directly so esbuild bundles them
import { renderLineage } from './managing/lineage';
import './style.css';
import { testData, testDataReverse } from './test_data/test_data';
import { getVsCodeApi } from './utils/vscodeAPI';

// 2. Import components & helpers

const vscode = getVsCodeApi();





document.addEventListener('DOMContentLoaded', () => {
  
    renderLineage(testDataReverse)
});


