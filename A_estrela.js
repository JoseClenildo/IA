function aStarChess(start, end, threatenedPositions) {
  var openSet = [start];
  var closedSet = [];
  var cameFrom = {};

  var gScore = {};
  var fScore = {};

  gScore[start] = 0;
  fScore[start] = heuristic(start, end);

  while (openSet.length > 0) {
    var current = findLowestFScore(openSet, fScore);
    
    if (current.toString() === end.toString()) {
      return reconstructPath(cameFrom, current);
    }

    openSet.splice(openSet.indexOf(current), 1);
    closedSet.push(current);

    var neighbors = getChessNeighbors(current, threatenedPositions);

    for (var i = 0; i < neighbors.length; i++) {
      var neighbor = neighbors[i];
      if (closedSet.some(function(pos) { return pos.toString() === neighbor.toString(); })) continue;

      var tentativeGScore = gScore[current] + 1;

      if (!openSet.some(function(pos) { return pos.toString() === neighbor.toString(); }) || tentativeGScore < gScore[neighbor]) {
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentativeGScore;
        fScore[neighbor] = tentativeGScore + heuristic(neighbor, end);

        if (!openSet.some(function(pos) { return pos.toString() === neighbor.toString(); })) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return null; // No path found
}

function heuristic(a, b) {
  // Manhatten distance
  const [x1, y1] = a;
  const [x2, y2] = b;
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function findLowestFScore(set, scores) {
  return set.reduce((minNode, node) => (scores[node] < scores[minNode] ? node : minNode), set[0]);
}

function getChessNeighbors(position, threatenedPositions) {
  const [x, y] = position;
  const neighbors = [];

  // Considerando apenas movimentos do rei no xadrez
  const kingMoves = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];

  for (const move of kingMoves) {
    const [dx, dy] = move;
    const newX = x + dx;
    const newY = y + dy;

    const isThreatened = threatenedPositions.some(pos => pos[0] === newX && pos[1] === newY);

    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8 && !isThreatened) {
      neighbors.push([newX, newY]);
    }
  }

  return neighbors;
}


function reconstructPath(cameFrom, current) {
  const path = [current];

  while (cameFrom[current]) {
    current = cameFrom[current];
    path.unshift(current);
  }

  return path;
}

// Exemplo de uso
// Exemplo de uso com mais casas ameaçadas
const start = [0, 0];
const end = [7, 7];
const threatenedPositions = [
  [2, 2], [2, 3], [3, 4], [4, 5], // Casas ameaçadas originais
  [1, 1], [5, 1], [6, 5] // Adicionando mais casas ameaçadas
];

const path = aStarChess(start, end, threatenedPositions);
console.log(path);
