---
layout: default
stitle: "PDF Reader"
---

<style>
    #pdf-render {
        max-width: 100%;
        height: auto;
        border: 1px solid #ccc;
    }
    #pdf-controls button {
        padding: 5px 10px;
        margin: 0 5px;
        font-size: 12px;
    }
    #ddl button {
        padding: 5px 10px;
        margin: 0 5px;
        font-size: 12px;
    }
    #keyboard button {
        padding: 5px 10px;
        margin: 0 5px;
        font-size: 12px;
    }
</style>

<div style="text-align: center;">
    <div id="pdf-controls" style="text-align: center; margin-bottom: 10px;">
        <button id="prev">←</button>
        <span>Page: <span id="page-num">1</span> / <span id="page-count">?</span></span>
        <button id="next">→</button>
    </div>
    <div id="loading" style="text-align: center;">Loading...</div>
    <div id="canvasContainer" style="text-align: center;">
        <canvas id="pdf-render" style="width: 85%; height: auto; border: 1px solid #ccc;"></canvas>
    </div>
    <br>
    <div id="ddl" style="text-align:right">
        <button id="download">⤓ Download</button>
    </div>
</div>

<div id="result-modal">
    <div id="result-box" style="text-align: center;">
        <div id="result-text">Password required for opening this file.</div>
        <br>
        <input id="usrPassword" type="password" placeholder="Enter the password...">
        <br><br>
        <div id="keyboard">
            <button id="1">1</button> <button id="2">2</button> <button id="3">3</button> <button id="4">4</button> <button id="5">5</button><br><br>
            <button id="6">6</button> <button id="7">7</button> <button id="8">8</button> <button id="9">9</button> <button id="0">0</button><br><br>
            <button id="clear" style="font-size: 14px">Clear</button>
            <button id="enter" style="font-size: 14px">Enter</button>
        </div>
    </div>
</div>

<script src="pdf-reader.js"></script>