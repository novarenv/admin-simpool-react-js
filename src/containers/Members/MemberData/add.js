import React, { Component } from 'react';
import ContentWrapper from '../../../components/Layout/ContentWrapper';

import AddValidation from './addValidation.js';

class MemberDataAdd extends Component {
    render() {
        return (
            <ContentWrapper>
                <div className="content-heading">
                    <div>Anggota Baru</div>
                </div>

                <AddValidation />
            </ContentWrapper>
        );
    }
}

export default MemberDataAdd;