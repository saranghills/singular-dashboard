import logo from './logo.svg';
import './App.css';

import { AgGridReact } from 'ag-grid-react';
import { ColDef, ValueGetterParams } from 'ag-grid-community';
import { useState, useEffect, useMemo, useRef } from 'react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';

import { Bar, getDatasetAtEvent } from 'react-chartjs-2';


ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
)



function App() {


    const [rowData, setRowData] = useState();


    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Company',
            valueGetter: companyValueGetter,
        },
        { field: 'nation', headerName: 'Country' },
        { field: 'installs' },
        {
            headerName: 'ROI',
            valueGetter: roiValueGetter,
        }, {
            headerName: 'Industry ROI',
            valueGetter: indroiValueGetter,
        }
    ]);


    const defaultColDef = useMemo(() => ({

        sortable: true,
        filter: true,
        floatingFilter: true


    }), []);


    useEffect(() => {
        fetch('http://localhost:3000/details?_expand=company&_expand=country')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))

    }, []);



    function companyValueGetter(params: ValueGetterParams) {

        return (params?.data?.company?.display_name);

    }

    function roiValueGetter(params: ValueGetterParams) {
        const roi = params.data.revenue / params.data.cost;
        return (roi.toFixed(2) + '%');
    }

    function indroiValueGetter(params: ValueGetterParams) {
        const roi = params.data.country.revenue / params.data.country.cost;
        return (roi.toFixed(2) + '%');
    }

   
    const [ab, setAb] = useState(1)
   

    const buttonClick = (event) => {
        var button = event.target.id;

        if (button == 'roi') {
            setAb(1);
        }

        if (button == 'installs') {
            setAb(2);
        }
    }



    function formula(inputdata) {
        
        if (ab == 1) {
            
            return inputdata?.map(x => x.revenue / x.cost);
        } else {
            
            return inputdata?.map(x => x.installs);
        }
    }

    function showlabel() {

        if (ab == 1) {
            return 'ROI' ;
        } else {
            return 'Installs';
        }
    }


    const data = {
     
        labels: rowData?.map(x => x.company?.display_name + ' - ' + x.nation),

        datasets: [{
            label: showlabel() ,
            data: formula(rowData),

            backgroundColor: ['#9875d3', '#539ae4', '#72bfb7', '#f2a35e', '#db6e67'],
            borderWidth: 1,


        }
    ]
    }

    const options = {
        scales: {
            y:
            {

            },
            x:
            {
                min: 0,
                max: 4,
                stepSize: 3,
            },
        },
        plugins: {
            legend: {
                display: false,
                align: 'start',
                title: {
                    padding: 50
                }
            }
        }
    };


    return (
        <div className="container">
       
            <h1 className="tableHeader"> Data Report</h1>
            <div className="buttenwrapper">
                <button className="buttons" id="roi" onClick={buttonClick} >ROI</button>
                <button className="buttons" id="installs" onClick={buttonClick} > Installs</button>
            </div>

        <div className='ag-theme-alpine'
            style={{ height:500, width:'100%'
                }}        >

                <Bar
                data={data}
                options={options}

                >
                   
                </Bar>

            <AgGridReact
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                    />
            </div>
        </div>
  );
}

export default App;
