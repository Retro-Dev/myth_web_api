import React from "react";
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';
import Breadcrumb from '../Common/Breadcrumb';
import Footer from '../Common/Footer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import faker from 'faker';

function Index() {
  return (
    <>
      <Header />
      <Sidebar />
      <Breadcrumb page_title='Dashboard' />
      <section className="main-content">
          <div className="row">
              <div className="col-md-12 mb-2">
                <h1>App Widgets</h1>
              </div>
              <div className="col">
                  <div className="widget bg-light padding-0">
                      <div className="row row-table">
                          <div className="col-xs-4 text-center padding-15 bg-primary">
                              <em className="icon-bag fa-3x"></em>
                          </div>
                          <div className="col-xs-8 padding-15 text-right">
                              <h2 className="mv-0">4758</h2>
                              <div className="margin-b-0 text-muted">Sales</div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="col">
                  <div className="widget bg-light padding-0">
                      <div className="row row-table">
                          <div className="col-xs-4 text-center padding-15 bg-teal">
                              <em className="icon-basket fa-3x"></em>
                          </div>
                          <div className="col-xs-8 padding-15 text-right">
                              <h2 className="mv-0">785</h2>
                              <div className="margin-b-0 text-muted">Orders</div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="col">
                  <div className="widget bg-light padding-0">
                      <div className="row row-table">
                          <div className="col-xs-4 text-center padding-15 bg-success">
                              <em className="icon-people fa-3x"></em>
                          </div>
                          <div className="col-xs-8 padding-15 text-right">
                              <h2 className="mv-0">1235</h2>
                              <div className="margin-b-0 text-muted">Users</div>
                          </div>
                      </div>
                  </div>
              </div>
              <div className="col">
                  <div className="widget bg-light padding-0">
                      <div className="row row-table">
                          <div className="col-xs-4 text-center padding-15 bg-indigo">
                              <em className="icon-pie-chart fa-3x"></em>
                          </div>
                          <div className="col-xs-8 padding-15 text-right">
                              <h2 className="mv-0">2558 $</h2>
                              <div className="margin-b-0 text-muted">Profit</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <h1>Sales Overview</h1>
              <p>Lorem Ipsum is simply dummy text of the printing</p>
              <Line options={options} data={data} />
            </div>
          </div>
        <Footer />
      </section>
    </>
  )
}

export default React.memo(Index)

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};
const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};
