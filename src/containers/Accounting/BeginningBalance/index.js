import React, { Component } from 'react';
import Datasheet from 'react-datasheet';
// Be sure to include styles at some point, probably during your bootstrapping
import 'react-datasheet/lib/react-datasheet.css';
import { Container, Card, CardBody } from 'reactstrap';

import ContentWrapper from '../../../components/Layout/ContentWrapper';

const grid = [
  [{ value: 5, expr: '1 + 4' }, { value: 6, expr: '6' }, { value: new Date('2008-04-10') }],
  [{ value: 5, expr: '1 + 4' }, { value: 5, expr: '1 + 4' }, { value: new Date('2004-05-28') }]
]
const onCellsChanged = (changes) => changes.forEach(({ cell, row, col, value }) => console.log("New expression :" + value))

class NewAccountBalance extends Component {
  constructor(props) {
    super(props)
    this.state = {
      grid: [
        [
          { readOnly: true, value: '' },
          { value: 'A', readOnly: true },
          { value: 'B', readOnly: true },
          { value: 'C', readOnly: true },
          { value: 'D', readOnly: true }
        ],
        [{ readOnly: true, value: 1 }, { value: 1 }, { value: 3 }, { value: 3 }, { value: 3 }],
        [{ readOnly: true, value: 2 }, { value: 2 }, { value: 4 }, { value: 4 }, { value: 4 }],
        [{ readOnly: true, value: 3 }, { value: 1 }, { value: 3 }, { value: 3 }, { value: 3 }],
        [{ readOnly: true, value: 4 }, { value: 2 }, { value: 4 }, { value: 4 }, { value: 4 }]
      ]
    }
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Data Pinjaman</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <Datasheet
                data={this.state.grid}
                valueRenderer={(cell) => cell.value}
                onContextMenu={(e, cell, i, j) => cell.readOnly ? e.preventDefault() : null}
                onCellsChanged={changes => {
                  const grid = this.state.grid.map(row => [...row])
                  changes.forEach(({ cell, row, col, value }) => {
                    grid[row][col] = { ...grid[row][col], value }
                  })
                  this.setState({ grid })
                }}
              />
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    )
  }
}

export default NewAccountBalance;