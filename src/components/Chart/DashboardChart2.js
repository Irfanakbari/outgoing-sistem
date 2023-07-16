import {BarChart, Card, Title} from "@tremor/react";

export default function Chart2({data}) {
    return (<Card className={``}>
        <Title>Diagram Total Pallet</Title>
        <BarChart
            className="mt-2"
            data={data}
            index="customer"
            layout={'vertical'}
            showXAxis={true}
            showTooltip={true}
            showLegend={true}
            showGridLines={false}
            showAnimation={true}
            categories={["Total"]}
            colors={["indigo"]}
            yAxisWidth={40}
            stack={false}
            relative={false}
            startEndOnly={false}
            showYAxis={true}
            maxValue={250}
            autoMinValue={false}
        />
    </Card>)
}