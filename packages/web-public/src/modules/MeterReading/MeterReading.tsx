import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Title,
  ZoomAndPan,
  Tooltip,
} from "@devexpress/dx-react-chart-material-ui";
import { ChartProps, EventTracker } from "@devexpress/dx-react-chart";
import { scaleBand } from "@devexpress/dx-chart-core";
import { ArgumentScale, Stack } from "@devexpress/dx-react-chart";
import { gql, useQuery } from "@apollo/client";
// TODO: Import separately
import { Input, Box, Container } from "@material-ui/core";

const getMode = (zoom: boolean, pan: boolean) => {
  if (zoom && pan) {
    return "both";
  }
  if (zoom && !pan) {
    return "zoom";
  }
  if (!zoom && pan) {
    return "pan";
  }
  return "none";
};

const chartRootStyle = { marginRight: "20px" };

const ChartRoot = (props: ChartProps) => (
  // @ts-ignore
  <Chart.Root {...props} style={chartRootStyle} />
);
const METER_READING = gql`
  query MeterReadingQuery($filter: String) {
    meters(filter: $filter) {
      name
      readings {
        varh
        wh
        createdAt
      }
    }
  }
`;

// const getMinMaxDate = (data) => {
//   if (data) {
//     let minDate = null;
//     let maxDate = null;
//     let dates = [];

//     const { meters } = data;
//     for (let i = 0; i < meters.length; i++) {
//       dates.push(
//         ...meters[i].readings.map((reading) => {
//           return reading.createdAt;
//         })
//       );
//     }
//     minDate = Math.min.apply(null, dates);
//     maxDate = Math.max.apply(null, dates);
//     console.log("Min Date: ", minDate);
//     console.log("Max Date: ", maxDate);
//     return [minDate, maxDate];
//   }
//   return [0, 0];
// };

export const MeterReadingLineChart = () => {
  const [searchInput, setSearchInput] = React.useState("");
  const { data } = useQuery(METER_READING, {
    variables: {
      filter: searchInput,
    },
  });

  let dataToDisplay = [];
  if (data) {
    const { meters } = data;
    dataToDisplay = meters.map((meter: any) =>
      meter.readings.map((reading: any) => {
        const dateTimeFormat = new Intl.DateTimeFormat("en", {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "numeric",
          minute: "numeric",
          hour12: false,
        });
        const dateTimeParts = dateTimeFormat.formatToParts(
          new Date(Number(reading.createdAt))
        );
        const [
          { value: month },
          ,
          { value: day },
          ,
          { value: year },
          ,
          { value: hour },
          ,
          { value: minute },
        ] = dateTimeParts;
        return {
          label: `${day} ${month} ${year} ${hour}:${minute}`,
          x: reading.wh,
          y: reading.varh,
        };
      })
    )[0];
  }
  const [state] = React.useState({
    dataToDisplay,
    zoomArgument: true,
    panArgument: true,
    zoomValue: false,
    panValue: false,
  });

  const { zoomValue, panValue, zoomArgument, panArgument } = state;
  return (
    <Container>
      <Paper>
        <Box display="flex" alignItems="flex-end" m={5}>
          <Input
            // TODO: Debounce this, instead of sending request to DB on each key stroke,
            // or add a submit button?
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            placeholder="Enter full meter number..."
          />
        </Box>
        {dataToDisplay && (
          <Box mx={5}>
            <Chart
              data={dataToDisplay.splice(0, 100)}
              // @ts-ignore
              rootComponent={ChartRoot}
            >
              {data && (
                <Title
                  text={`Meter Readings for device: ${data.meters[0].name}`}
                />
              )}
              <ArgumentScale factory={scaleBand} />
              <ArgumentAxis />
              <ValueAxis />

              <BarSeries valueField="x" argumentField="label" />
              <BarSeries valueField="y" argumentField="label" />
              <Stack />
              <ZoomAndPan
                interactionWithArguments={getMode(zoomArgument, panArgument)}
                interactionWithValues={getMode(zoomValue, panValue)}
              />
              <EventTracker />
              <Tooltip />
            </Chart>
          </Box>
        )}
      </Paper>
    </Container>
  );
};
