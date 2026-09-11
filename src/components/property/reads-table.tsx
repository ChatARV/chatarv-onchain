import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StellarLink } from "@/components/stellar-link";
import { formatDateTime, formatUsdFee } from "@/lib/format";
import { truncateMiddle } from "@/lib/stellar";
import type { ReadEvent } from "@/lib/schemas";

const TYPE_LABEL: Record<ReadEvent["consumerType"], string> = {
  lending: "Lending",
  tokenization: "Tokenization",
  vault: "Vault",
};

export function ReadsTable({ reads }: { reads: ReadEvent[] }) {
  if (reads.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No reads recorded for this property yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Consumer</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-right">Fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reads.slice(0, 25).map((read) => (
            <TableRow key={read.id}>
              <TableCell className="font-mono text-xs">
                <StellarLink showIcon={false} className="text-xs">
                  {truncateMiddle(read.consumerAddress, 6, 6)}
                </StellarLink>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{TYPE_LABEL[read.consumerType]}</Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(read.timestamp)}
              </TableCell>
              <TableCell className="text-right font-mono text-xs tabular-nums">
                {formatUsdFee(read.feeUsdc)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
