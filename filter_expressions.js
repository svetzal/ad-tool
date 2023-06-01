class FilterExpression {}

class AttributeExpression extends FilterExpression {
    constructor(attribute, value) {
        super();
        this.attribute = attribute;
        this.value = value;
    }

    toString() {
        return `(${this.attribute}=${this.value})`;
    }
}

class NotExpression extends FilterExpression {
    constructor(operand) {
        super();
        if (!(operand instanceof FilterExpression)) throw new Error('Operand must be a FilterExpression');
        this.operand = operand;
    }

    toString() {
        return `(!${this.operand.toString()})`;
    }
}

class BinaryExpression extends FilterExpression {
    constructor(...operands) {
        super();
        for (const operand of operands) {
            if (!(operand instanceof FilterExpression)) throw new Error('Operands must be FilterExpressions');
        }
        this.operands = operands;
    }
}

class AndExpression extends BinaryExpression {
    toString() {
        return `(&${this.operands.map(operand => operand.toString()).join('')})`;
    }
}

class OrExpression extends BinaryExpression {
    toString() {
        return `(|${this.operands.map(operand => operand.toString()).join('')})`;
    }
}

module.exports = {
    FilterExpression,
    AttributeExpression,
    NotExpression,
    AndExpression,
    OrExpression
}