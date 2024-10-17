import PropTypes from "prop-types";

export function GridPattern({ columns = 41, rows = 11 }) {
  return (
    <div className="flex flex-wrap items-center justify-center flex-shrink-0 scale-105 bg-gray-100 dark:bg-neutral-900 gap-x-px gap-y-px">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex flex-shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          );
        })
      )}
    </div>
  );
}

GridPattern.propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
};

export default GridPattern;
