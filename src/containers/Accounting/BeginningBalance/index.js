import React, { Component } from 'react';
import ReactDataSheet from 'react-datasheet';
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
  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          <div>Data Pinjaman</div>
        </div>
        <Container fluid>
          <Card>
            <CardBody>
              <ReactDataSheet
                data={grid}
                valueRenderer={(cell, i,  j) => j === 2 ? cell.value.toDateString() : cell.value}
                dataRenderer={(cell, i, j) => j === 2 ? cell.value.toISOString() : cell.expr}
                onCellsChanged={onCellsChanged}
              />
            </CardBody>
          </Card>
        </Container>
      </ContentWrapper>
    )
  }
}

export default NewAccountBalance;