var gRandCells = []
var gBoard = []
var gLevel = { size: 16, mines: 2 }
var gGame = { isOn: false, shownCount: 0, markedBoard: 0, secPassed: 0 }
var gInterval
var gSizeSqrt
var mine = '💣'

function onInit() {
  gSizeSqrt = Math.sqrt(gLevel.size)
  gBoard = buildBoard()
  addMines()
  setMinesNegsCount(gBoard)
  renderBoard(gBoard)
}

function buildBoard() {
  const board = []
  for (var i = 0; i < gSizeSqrt; i++) {
    board[i] = []
    for (var j = 0; j < gSizeSqrt; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: true,
      }
    }
  }
  console.log(board)
  return board
}

function renderBoard(board) {
  var strHTML = ''
  for (var i = 0; i < board.length; i++) {
    strHTML += `<tr>`
    for (var j = 0; j < board[0].length; j++) {
      var cellClass = getClassName({ i: i, j: j }) + ' '
      if (gBoard[i][j].isShown) {
        if (board[i][j].isMine) {
          // RENDER MINE CELL
          strHTML += `<td class="cell ${cellClass}" onClick="onCellClicked(this,${i},${j})">${mine}</td>\n`
        } else if (board[i][j].isMine === false) {
          var cellValue =
            board[i][j].minesAroundCount === 0 ? '' : board[i][j].minesAroundCount
          // RENDER REGULAR CELL
          strHTML += `<td class="cell ${cellClass}" onClick="onCellClicked(this,${i},${j})">${cellValue}</td>\n`
        } 
      } else {
        strHTML += `<td class="cover cell ${cellClass}" onClick="onCellClicked(this,${i},${j})"></td>\n`
      }
    }
    strHTML += `</tr>`
  }
  var elTable = document.querySelector('.board')
  elTable.innerHTML = strHTML
  document.querySelector('.mines').innerText = `mines: ${gLevel.mines}`
  document.querySelector('.game_time').innerText = `Time: 0`
}


function onCellClicked(elCell, iIdx, jIdx) {
  if (!gBoard[iIdx][jIdx].isShown) {
    gBoard[iIdx][jIdx].isShown = true

    if (gBoard[iIdx][jIdx].isMine === true) {
      showAllMines()
      //TODO add game over modal
    } else if (gBoard[iIdx][jIdx].minesAroundCount === 0 ) {
      for (var i =  iIdx - 1; i <= iIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = jIdx - 1; j <= jIdx + 1; j++) {
          if (j < 0 || j >= gBoard[i].length) continue
          if (i === gBoard[i] && j === gBoard[j]) continue
          gBoard[i][j].isShown = true
          
        }
      }
    }
  }
  renderBoard(gBoard)
}

function showAllMines() {
  for (var i = 0; i < gBoard.length; i++) {
    for (var j = 0; j < gBoard.length; j++) {
      if (gBoard[i][j].isMine === true) {
        gBoard[i][j].isShown = true
      }
    }
  }

}

function onCellMarked(elCell) {
  elCell.document.querySelector('')
}

function setMinesNegsCount(board) {
  var currCell
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      currCell = board[i][j]
      if (currCell.isMine === false) {
        var negsCount = getCellNegsCount({ i, j }, board)
        currCell.minesAroundCount = negsCount
      }
    }
  }
}

function getCellNegsCount(cell, board) {
  var negsCount = 0
  for (var i = cell.i - 1; i <= cell.i + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = cell.j - 1; j <= cell.j + 1; j++) {
      if (j < 0 || j >= board[i].length) continue
      if (i === cell.i && j === cell.j) continue
      var currCell = board[i][j]
      if (currCell.isMine === true) negsCount++
    }
  }
  return negsCount
}

function addMines() {
  for (var i = 0; i < gLevel.mines; i++) {
    var pos = randUnusedLocation()
    gBoard[pos.i][pos.j].isMine = true
  }
  gRandCells = []
}

function randUnusedLocation() {
  if (gRandCells.length === 0)
    for (var i = 0; i < gBoard.length; i++) {
      for (var j = 0; j < gBoard.length; j++) {
        gRandCells.push({ i, j })
      }
    }

  var randIdx = getRandomInt(0, gRandCells.length)

  return gRandCells.splice(randIdx, 1)[0]
}

function checkGameOver() {}

function startTimer() {
  var start = Date.now()
  gInterval = setInterval(() => {
    var currTime = Date.now()
    var delta = currTime - start
    delta /= 1000
    delta.toFixed(3)
    document.querySelector('.game_time').innerText = `Time: ${delta}`
  }, 100)
}

function getClassName(location) {
  const cellClass = 'cell-' + location.i + '-' + location.j
  return cellClass
}

function renderCell(location, value) {
  const cellSelector = '.' + getClassName(location) // cell-i-j
  const elCell = document.querySelector(cellSelector)
  elCell.innerText = value
}

function onChangeDifficulty(elRadio) {
  var value = +elRadio.value
  if (value === 16) {
    gLevel.mines = 2
  } else if (value === 64) {
    gLevel.mines = 14
  } else if (value === 144) {
    gLevel.mines = 32
  }
  gLevel.size = value
  onInit()
}
