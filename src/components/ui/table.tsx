import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Table = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) => (
  <table
    className={cn("w-full caption-bottom text-sm tabular-nums", className)}
    {...props}
  />
);
Table.displayName = "Table";

export const TableHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead
    className={cn(
      "bg-muted/50 text-muted-foreground/90 backdrop-blur supports-[backdrop-filter]:backdrop-blur [&_th]:uppercase [&_th]:tracking-wide [&_th]:text-xs [&_th]:font-semibold [&_th]:text-muted-foreground",
      className,
    )}
    {...props}
  />
);
TableHeader.displayName = "TableHeader";

export const TableBody = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);
TableBody.displayName = "TableBody";

export const TableFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) => (
  <tfoot
    className={cn("bg-muted/50 font-medium text-foreground", className)}
    {...props}
  />
);
TableFooter.displayName = "TableFooter";

export const TableRow = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr
    className={cn(
      "border-b border-border transition-colors hover:bg-muted/80 data-[state=selected]:bg-muted odd:bg-muted/30",
      className,
    )}
    {...props}
  />
);
TableRow.displayName = "TableRow";

export const TableHead = ({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "h-10 px-6 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 first:rounded-l-lg last:rounded-r-lg",
      className,
    )}
    {...props}
  />
);
TableHead.displayName = "TableHead";

export const TableCell = ({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 first:pl-6 last:pr-6",
      className,
    )}
    {...props}
  />
);
TableCell.displayName = "TableCell";

export const TableCaption = ({
  className,
  ...props
}: HTMLAttributes<HTMLTableCaptionElement>) => (
  <caption
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
);
TableCaption.displayName = "TableCaption";
