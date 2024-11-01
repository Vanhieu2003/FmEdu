import { Card, CardContent, Skeleton } from "@mui/material";

export const ChartSkeleton = () => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Skeleton variant="rectangular" width="100%" height={300} />
      </CardContent>
    </Card>
  );