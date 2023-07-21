import { Card, Title, BarChart } from "@tremor/react";


export default function Chart1({data}) {
    return (<Card className={`mb-5 col-span-2`}>
        <Title>Diagram Stok Pallet Per Customer</Title>
        <BarChart
            className="mt-2"
            data={data}
            index="customer"
            showXAxis={true}
            showTooltip={true}
            showLegend={true}
            showGridLines={true}
            showAnimation={true}
            categories={["Tersedia", "Keluar", "Maintenance"]}
            colors={["green", "red", "amber"]}
            yAxisWidth={30}
            stack={false}
            relative={false}
            startEndOnly={false}
            showYAxis={true}
            autoMinValue={false}
        />
    </Card>)
}

