"use client";
import { isToday, isYesterday, parseISO } from "date-fns";
const isNew = (created_at: string) => {
  if (!created_at) {
    return false;
  }
  const date = parseISO(created_at);
  return isToday(date) || isYesterday(date);
};
import SkeletonCard from "@/components/aidList/SkeletonCard";

import PaginationDemo from "@/components/aidList/pagination";

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

const providerData = [
  {
    name: "K-스타트업",
    url: "https://www.k-startup.go.kr/web/contents/bizpbanc-ongoing.do",
  },
  {
    name: "기업마당",
    url: "https://www.bizinfo.go.kr/web/lay1/bbs/S1T122C128/AS/74/list.do",
  },
  {
    name: "서울경제진흥원",
    url: "https://www.sba.seoul.kr/Pages/ContentsMenu/Company_Support.aspx?C=AFF3B5BF-6677-EC11-80E8-9418827691E2",
  },
  {
    name: "창조경제혁신센터",
    url: "https://ccei.creativekorea.or.kr/seoul/custom/notice_list.do?&page=2",
  },
  {
    name: "지역지식재산센터RIPC",
    url: "https://www.ripc.org/www2/portal/notice/ripc4NoticeList.do",
  },
  {
    name: "이지비즈",
    url: "https://www.egbiz.or.kr/prjCategory/a/m/selectPrjCategoryList.do?part=category",
  },
  { name: "정보통신산업진흥원(NIPA)", url: "https://www.nipa.kr/" },
  {
    name: "중소기업기술정보진흥원(TIPA)",
    url: "https://www.smtech.go.kr/front/ifg/no/notice02_list.do",
  },
];

const providers = providerData.map((provider) => provider.name);

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
  created_at: string;
};

const columns: ColumnDef<Chat>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          번호
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          종료
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          공고일
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
  const [filteredData, setFilteredData] = React.useState<Chat[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [selectedProviders, setSelectedProviders] = React.useState<string[]>(
    providers.filter(
      (provider) =>
        provider !== "지역지식재산센터RIPC" &&
        provider !== "창조경제혁신센터" &&
        provider !== "정보통신산업진흥원(NIPA)"
    )
  );

  React.useEffect(() => {
    async function loadData() {
      var data = await fetchChatData();
      setData(data);
    }
    loadData();
  }, []);

  const table = useReactTable({
    data: filteredData,
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
        pageSize: 15,
      },
    },
  });

  const handleProviderChange = (providerName: string) => {
    setSelectedProviders((prevSelectedProviders) => {
      if (prevSelectedProviders.includes(providerName)) {
        return prevSelectedProviders.filter((name) => name !== providerName);
      } else {
        return [...prevSelectedProviders, providerName];
      }
    });
  };

  React.useEffect(() => {
    const newFilteredData = data.filter((item) =>
      selectedProviders.includes(item.provider)
    );
    setFilteredData(newFilteredData);
  }, [data, selectedProviders]);

  return (
    <div className={styles.container}>
      <div>
        <TypographyH1>지원사업 모음</TypographyH1>

        <div className="text-lg font-semibold">
          매일 19시에 업데이트 됩니다.
        </div>
        <TypographyP>아래의 사이트들로부터 자료를 제공받았습니다.</TypographyP>
        <p className="text-sm text-muted-foreground">
          표시할 공고처를 선택하세요
        </p>
        <ul>
          {providerData.map((provider) => (
            <li key={provider.name} className="hover:text-red-500">
              <div className="flex  items-left">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={provider.name}
                    checked={selectedProviders.includes(provider.name)}
                    onCheckedChange={() => handleProviderChange(provider.name)}
                  />
                  <label
                    htmlFor={provider.name}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {provider.name}
                  </label>
                </div>
                <Link href={provider.url}>
                  <Button variant="link" className="ml-5">
                    <p className="text-sm text-muted-foreground">페이지 방문</p>
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder="제목 검색"
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[10, 15, 20, 25, 30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
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
        <div className="space-x-2">
          <PaginationDemo
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            setPage={table.setPageIndex}
            pageSize={table.getState().pagination.pageSize}
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            getCanPreviousPage={table.getCanPreviousPage}
            getCanNextPage={table.getCanNextPage}
          />
        </div>
      </div>
    </div>
  );
}
