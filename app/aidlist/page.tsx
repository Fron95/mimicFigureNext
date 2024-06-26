"use client";
import { isToday, isYesterday, parseISO } from "date-fns";
const isNew = (created_at:string) => {
  if (!created_at) {
    return false;
  }
  const date = parseISO(created_at);
  return isToday(date) || isYesterday(date);
};
import SkeletonCard from "@/components/aidList/SkeletonCard";

import styles from "./page.module.css";
import TypographyH1 from "@/components/selftalk/TypographyH1";
import TypographyH2 from "@/components/selftalk/TypographyH2";
import TypographyP from "@/components/selftalk/TypographyP";

import * as React from "react";
import Link from "next/link";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Supabase 클라이언트 설정
import { createClient } from "@supabase/supabase-js";
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchChatData() {
  const { data, error } = await supabase
    .from("aid_list")
    .select("*")
    .order("sort_date", { ascending: false });

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }

  return data;
}

type Chat = {
  id: string;
  title: string;
  description: string;
  startdate: string;
  enddate: string;
  registerdate: string;
  region: string;
  category: string;
  organization: string;
  url: string;
  provider: string;
  created_at : string;
};

const columns: ColumnDef<Chat>[] = [
  {
    accessorKey: "id",
    header: "번호",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    size: 70,
  },
  {
    accessorKey: "category",
    header: "분류",
    cell: ({ row }) => <div>{row.original.category}</div>,
    size: 300,
  },
  {
    accessorKey: "title",
    header: "내용",
    cell: ({ row }) => (
      <a href={row.original.url} target="_blank" rel="noopener noreferrer">
        <div>
          <div style={{ fontSize: "1.125rem", fontWeight: "bold" }}>
            {row.original.title}
          </div>
          <div>{row.original.description ?? ""}</div>
        </div>
      </a>
    ),
    size: 300,
  },
  {
    accessorKey: "startdate",
    header: "시작",
    cell: ({ row }) => {
      const startdate = row.getValue("startdate") as string | undefined;
      return (
        <div>{startdate ? new Date(startdate).toLocaleDateString() : "-"}</div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "enddate",
    header: "종료",
    cell: ({ row }) => {
      const endDate = row.getValue("enddate") as string | undefined;
      return (
        <div>{endDate ? new Date(endDate).toLocaleDateString() : "-"}</div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "remaining",
    header: "남은기간",
    cell: ({ row }) => {
      const endDateValue = row.getValue("enddate") as string | undefined;
      if (!endDateValue) return <div>-</div>;

      const endDate = new Date(endDateValue);
      const today = new Date();
      const diffTime = endDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return (
        <div>{diffDays > 0 ? `D-${diffDays}` : `D+${Math.abs(diffDays)}`}</div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "region",
    header: "지역",
    cell: ({ row }) => <div>{row.getValue("region") ?? "-"}</div>,
    size: 150,
  },
  {
    accessorKey: "organization",
    header: "기관",
    cell: ({ row }) => <div>{row.getValue("organization") ?? "-"}</div>,
    size: 150,
  },
  {
    accessorKey: "registerdate",
    header: "공고일",
    cell: ({ row }) => {
      const registerdate = row.getValue("registerdate") as string | undefined;
      return (
        <div>
          {registerdate ? new Date(registerdate).toLocaleDateString() : "-"}
        </div>
      );
    },
    size: 150,
  },
  {
    accessorKey: "provider",
    header: "정보제공",
    cell: ({ row }) => <div>{row.getValue("provider") ?? "-"}</div>,
    size: 150,
  },
];

export default function Home() {
  const [data, setData] = React.useState<Chat[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  React.useEffect(() => {
    async function loadData() {
      const data = await fetchChatData();
      setData(data);
    }
    loadData();
  }, []);

  const table = useReactTable({
    data,
    columns,

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 1000,
      },
    },
  });

  return (
    <div className={styles.container}>
      <div>
        <TypographyH1>지원사업 공지사항</TypographyH1>

        <div className="text-lg font-semibold">
          API 구축이 불완전하여, 매일 19시에 수동갱신됩니다.
        </div>
        <TypographyP>이용자가 많으면 자동업데이트 설치 예정입니다.</TypographyP>
        <TypographyP>아래의 사이트들로부터 자료를 제공받았습니다.</TypographyP>
        <ol className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li className="hover:text-red-500">
            <Link href="https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do">
              K-스타트업
            </Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do">
              기업마당
            </Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="https://www.sba.seoul.kr/Pages/ContentsMenu/Company_Support.aspx?C=AFF3B5BF-6677-EC11-80E8-9418827691E2">
              서울경제진흥원
            </Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="https://ccei.creativekorea.or.kr/seoul/custom/notice_list.do?&page=2">
              서울창조경제혁신센터
            </Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="https://www.ripc.org/www2/portal/notice/ripc4NoticeList.do">
              지역지식재산센터RIPC
            </Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="https://www.nipa.kr/">정보통신산업진흥원NIPA</Link>
          </li>
          <li className="hover:text-red-500">
            <Link href="https://www.smtech.go.kr/front/ifg/no/notice02_list.do">
              중소기업기술정보진흥원TIPA
            </Link>
          </li>
        </ol>
      </div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const created_at = row.original.created_at;
                const isNewRow = isNew(created_at);
                return (
                  <TableRow
                    className={isNewRow ? "bg-green-600 bg-opacity-25" : ""}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  데이터를 가져오는 중입니다 ...
                  <SkeletonCard />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
