import random
import sys
from dataclasses import dataclass
from typing import List, Optional, Tuple

SIZE = 9
BOX = 3
LEVEL_COUNT = 100

BASE_SOLUTION = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9],
    [4, 5, 6, 7, 8, 9, 1, 2, 3],
    [7, 8, 9, 1, 2, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 7, 8, 9, 1],
    [5, 6, 7, 8, 9, 1, 2, 3, 4],
    [8, 9, 1, 2, 3, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 8, 9, 1, 2],
    [6, 7, 8, 9, 1, 2, 3, 4, 5],
    [9, 1, 2, 3, 4, 5, 6, 7, 8],
]

RNG = random.Random(0)

@dataclass
class Level:
    number: int
    puzzle: List[List[int]]
    solution: List[List[int]]
    clues: int


def display_board(board: List[List[int]]) -> None:
    horizontal = "+-------+-------+-------+"
    print(horizontal)
    for row in range(SIZE):
        line = "| "
        for col in range(SIZE):
            value = board[row][col]
            line += str(value) if value != 0 else "."
            line += " "
            if (col + 1) % BOX == 0:
                line += "| "
        print(line)
        if (row + 1) % BOX == 0:
            print(horizontal)


def is_valid_value(board: List[List[int]], row: int, col: int, value: int) -> bool:
    if board[row][col] != 0:
        return False

    for i in range(SIZE):
        if board[row][i] == value or board[i][col] == value:
            return False

    start_row = row - row % BOX
    start_col = col - col % BOX
    for r in range(start_row, start_row + BOX):
        for c in range(start_col, start_col + BOX):
            if board[r][c] == value:
                return False

    return True


def find_empty_cell(board: List[List[int]]) -> Optional[Tuple[int, int]]:
    for r in range(SIZE):
        for c in range(SIZE):
            if board[r][c] == 0:
                return r, c
    return None


def solve_board(board: List[List[int]], limit: int = 2) -> int:
    empty = find_empty_cell(board)
    if not empty:
        return 1

    row, col = empty
    solutions = 0

    for value in range(1, SIZE + 1):
        if is_valid_value(board, row, col, value):
            board[row][col] = value
            solutions += solve_board(board, limit)
            board[row][col] = 0
            if solutions >= limit:
                return solutions

    return solutions


def solve_puzzle(board: List[List[int]]) -> Optional[List[List[int]]]:
    copy_board = [row[:] for row in board]
    if _solve_backtracking(copy_board):
        return copy_board
    return None


def _solve_backtracking(board: List[List[int]]) -> bool:
    empty = find_empty_cell(board)
    if not empty:
        return True

    row, col = empty
    for value in range(1, SIZE + 1):
        if is_valid_value(board, row, col, value):
            board[row][col] = value
            if _solve_backtracking(board):
                return True
            board[row][col] = 0
    return False


def shuffle_grid(grid: List[List[int]]) -> List[List[int]]:
    grid = [row[:] for row in grid]

    def shuffle_groups(groups: List[List[int]]) -> None:
        for group in groups:
            RNG.shuffle(group)

    def swap_rows_within_band(board: List[List[int]]) -> None:
        for b in range(0, SIZE, BOX):
            rows = board[b:b + BOX]
            RNG.shuffle(rows)
            board[b:b + BOX] = rows

    def swap_cols_within_stack(board: List[List[int]]) -> None:
        for b in range(0, SIZE, BOX):
            cols = [list(board[r][b:b + BOX]) for r in range(SIZE)]
            indices = list(range(BOX))
            RNG.shuffle(indices)
            for r in range(SIZE):
                for j, idx in enumerate(indices):
                    board[r][b + j] = cols[r][idx]

    def swap_band_rows(board: List[List[int]]) -> None:
        bands = [board[i:i+BOX] for i in range(0, SIZE, BOX)]
        RNG.shuffle(bands)
        for i, band in enumerate(bands):
            board[i*BOX:(i+1)*BOX] = band

    def swap_band_cols(board: List[List[int]]) -> None:
        cols = [ [row[i:i+BOX] for row in board] for i in range(0, SIZE, BOX) ]
        RNG.shuffle(cols)
        for c, block in enumerate(cols):
            for r in range(SIZE):
                board[r][c*BOX:(c+1)*BOX] = block[r]

    swap_rows_within_band(grid)
    swap_band_rows(grid)
    swap_cols_within_stack(grid)
    swap_band_cols(grid)

    mapping = list(range(1, SIZE + 1))
    RNG.shuffle(mapping)
    mapped = [[mapping[value - 1] for value in row] for row in grid]
    return mapped


def generate_complete_grid() -> List[List[int]]:
    return shuffle_grid(BASE_SOLUTION)


def remove_cells(grid: List[List[int]], removals: int) -> List[List[int]]:
    puzzle = [row[:] for row in grid]
    positions = [(r, c) for r in range(SIZE) for c in range(SIZE)]
    RNG.shuffle(positions)

    removed = 0
    for row, col in positions:
        if removed >= removals:
            break
        backup = puzzle[row][col]
        puzzle[row][col] = 0
        test_board = [r[:] for r in puzzle]
        if solve_board(test_board, limit=2) != 1:
            puzzle[row][col] = backup
        else:
            removed += 1

    return puzzle


def generate_levels() -> List[Level]:
    levels: List[Level] = []
    for number in range(1, LEVEL_COUNT + 1):
        solution = generate_complete_grid()
        removals = 30 + min(20, (number - 1) // 5)
        puzzle = remove_cells(solution, removals)
        clues = SIZE * SIZE - sum(1 for row in puzzle for value in row if value == 0)
        levels.append(Level(number=number, puzzle=puzzle, solution=solution, clues=clues))
    return levels


def board_equal(board_a: List[List[int]], board_b: List[List[int]]) -> bool:
    return all(board_a[r][c] == board_b[r][c] for r in range(SIZE) for c in range(SIZE))


def play_level(level: Level) -> bool:
    board = [row[:] for row in level.puzzle]
    print(f"\nNivel {level.number}: {level.clues} pistas")
    while True:
        display_board(board)
        if board_equal(board, level.solution):
            print(f"¡Felicidades! Has completado el nivel {level.number}.\n")
            return True

        user_input = input("Ingresa fila,columna,valor o 'salir': ").strip().lower()
        if user_input == "salir":
            print("Saliendo del juego Sudoku Pelu.")
            return False

        parts = [p.strip() for p in user_input.split(",")]
        if len(parts) != 3 or not all(part.isdigit() for part in parts):
            print("Formato incorrecto. Usa fila,columna,valor (ejemplo: 3,5,7).")
            continue

        fila, columna, valor = map(int, parts)
        if not (1 <= fila <= SIZE and 1 <= columna <= SIZE and 1 <= valor <= SIZE):
            print("Valores fuera de rango. Usa números entre 1 y 9.")
            continue

        row_index = fila - 1
        col_index = columna - 1
        if level.puzzle[row_index][col_index] != 0 and board[row_index][col_index] != 0:
            print("No puedes cambiar un valor fijo del nivel.")
            continue

        if not is_valid_value(board, row_index, col_index, valor):
            print("Movimiento inválido. Revisa filas, columnas y regiones 3x3.")
            continue

        board[row_index][col_index] = valor


def choose_level(levels: List[Level]) -> Optional[int]:
    print("Bienvenido a Sudoku Pelu: 100 niveles disponibles.")
    print("Puedes elegir un nivel entre 1 y 100, o escribir '0' para comenzar desde el primer nivel.")
    while True:
        choice = input("Selecciona nivel: ").strip()
        if choice.isdigit():
            level_num = int(choice)
            if level_num == 0:
                return 1
            if 1 <= level_num <= LEVEL_COUNT:
                return level_num
        print("Selecciona un número válido entre 1 y 100, o 0 para iniciar en el nivel 1.")


def main() -> None:
    levels = generate_levels()
    level_number = choose_level(levels)
    if level_number is None:
        return

    current = level_number
    while current <= LEVEL_COUNT:
        level = levels[current - 1]
        if not play_level(level):
            break
        if current == LEVEL_COUNT:
            print("¡Has completado los 100 niveles de Sudoku Pelu! Gracias por jugar.")
            break
        next_level = input("¿Quieres pasar al siguiente nivel? (s/n): ").strip().lower()
        if next_level != "s":
            print("Gracias por jugar Sudoku Pelu. Hasta la próxima.")
            break
        current += 1


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nJuego interrumpido. ¡Hasta luego!")
