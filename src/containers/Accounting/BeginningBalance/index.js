import React, { Component } from 'react';
import Datasheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { Container, Card, CardBody } from 'reactstrap';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

class NewAccountBalance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: [
        [
          {
            value: "Beginning Balance",
            forceComponent: true,
            disableEvents: true,
            colSpan: 11,
            component: (
              <div
                className="d-flex justify-content-between px-3 py-3 align-items-center"
                style={{ cursor: "default" }}
              >
                <div />
                <h5 style={{ marginBottom: "0" }}>Beginning Balance</h5>
                <div>
                  <button
                    className={`btn btn-sm btn-icon btn-primary mr-4`}
                  >
                    <i className="fas fa-minus" />
                  </button>

                  <button
                    type="button"
                    className="btn btn-sm btn-icon btn-primary"
                  >
                    <i className="fas fa-plus" />
                  </button>
                </div>
              </div>
            )
          }
        ],
        [
          {
            readOnly: true,
            value: `Account`,
            rowSpan: 2,
          },
          { value: "Balance 1", readOnly: true, colSpan: 3 },
          { value: "Balance 2", readOnly: true, colSpan: 3 },
          { value: "Balance 3", readOnly: true, colSpan: 3 },
          {
            value: `Sum`,
            rowSpan: 2,
            readOnly: true,
          }
        ],
        [
          { value: "1.1", readOnly: true },
          { value: "1.2", readOnly: true },
          { value: "1.3", readOnly: true },
          { value: "2.1", readOnly: true },
          { value: "2.2", readOnly: true },
          { value: "2.3", readOnly: true },
          { value: "3.1", readOnly: true },
          { value: "3.2", readOnly: true },
          { value: "3.3", readOnly: true },
        ],
        [
          {
            readOnly: true,
            value: `1 ~ 2`,
            rowSpan: 1,
          },
          { value: "Data 1" },
          { value: "Data 2" },
          { value: "Data 3" },
          { value: "Data 1" },
          { value: "Data 2" },
          { value: "Data 3" },
          { value: "Data 1" },
          { value: "Data 2" },
          { value: "Data 3" },
          { value: "Sum" },
        ],
      ]
    }
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Beginning Balance</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Datasheet
                data={this.state.rows}
                valueRenderer={cell => cell.value}
                onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
                onCellsChanged={changes => {
                  const rows = this.state.rows.map(row => [...row])
                  changes.forEach(({ cell, row, col, value }) => {
                    rows[row][col] = { ...rows[row][col], value }
                  })
                  this.setState({ rows })
                }}
                className="col-12"
              />
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    )
  }
}

export default NewAccountBalance;