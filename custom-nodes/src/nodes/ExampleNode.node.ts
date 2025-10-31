/**
 * ExampleNode
 *
 * Node de exemplo que demonstra as melhores práticas.
 * Este node recebe dados, transforma e retorna.
 *
 * @version 1.0.0
 */

import {
  INodeType,
  INodeTypeDescription,
  IExecuteFunctions,
  NodeOperationError,
  IDataObject,
} from 'n8n-workflow';

export class ExampleNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Example Node',
    name: 'exampleNode',
    icon: 'fa:star',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Node de exemplo para demonstração',
    defaults: {
      name: 'Example Node',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'exampleApiCredentials',
        required: false,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Transform',
            value: 'transform',
            description: 'Transforma os dados',
            action: 'Transform data',
          },
          {
            name: 'Validate',
            value: 'validate',
            description: 'Valida os dados',
            action: 'Validate data',
          },
          {
            name: 'Filter',
            value: 'filter',
            description: 'Filtra os dados',
            action: 'Filter data',
          },
        ],
        default: 'transform',
      },
      {
        displayName: 'Field Name',
        name: 'fieldName',
        type: 'string',
        default: '',
        placeholder: 'email',
        description: 'Nome do campo a processar',
        displayOptions: {
          show: {
            operation: ['transform', 'validate'],
          },
        },
      },
      {
        displayName: 'Filter Condition',
        name: 'filterCondition',
        type: 'string',
        default: '',
        placeholder: '$.value > 100',
        description: 'Condição para filtrar',
        displayOptions: {
          show: {
            operation: ['filter'],
          },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<any> {
    const items = this.getInputData();
    const returnData: IDataObject[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        const item = items[i];

        switch (operation) {
          case 'transform':
            const transformedItem = await ExampleNode.transformData(this, item.json, i);
            returnData.push(transformedItem);
            break;

          case 'validate':
            const validatedItem = await ExampleNode.validateData(this, item.json, i);
            returnData.push(validatedItem);
            break;

          case 'filter':
            const shouldInclude = await ExampleNode.filterData(this, item.json, i);
            if (shouldInclude) {
              returnData.push(item.json);
            }
            break;

          default:
            throw new NodeOperationError(
              this.getNode(),
              `Operation "${operation}" is not supported`
            );
        }
      } catch (error) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          returnData.push({
            json: {
              error: errorMessage,
            },
            pairedItem: { item: i },
          } as any);
          continue;
        }
        throw error;
      }
    }

    return [this.helpers.returnJsonArray(returnData)];
  }

  /**
   * Transforma os dados
   */
  private static async transformData(
    context: IExecuteFunctions,
    data: IDataObject,
    itemIndex: number
  ): Promise<IDataObject> {
    const fieldName = context.getNodeParameter('fieldName', itemIndex) as string;

    if (!fieldName) {
      throw new NodeOperationError(
        context.getNode(),
        'Field name is required for transform operation'
      );
    }

    return {
      ...data,
      [fieldName]: ExampleNode.transformValue(data[fieldName]),
      transformed: true,
      transformedAt: new Date().toISOString(),
    };
  }

  /**
   * Valida os dados
   */
  private static async validateData(
    context: IExecuteFunctions,
    data: IDataObject,
    itemIndex: number
  ): Promise<IDataObject> {
    const fieldName = context.getNodeParameter('fieldName', itemIndex) as string;

    if (!fieldName) {
      throw new NodeOperationError(
        context.getNode(),
        'Field name is required for validate operation'
      );
    }

    const isValid = ExampleNode.validateField(data[fieldName]);

    return {
      ...data,
      valid: isValid,
      validatedField: fieldName,
      validatedAt: new Date().toISOString(),
    };
  }

  /**
   * Filtra os dados
   */
  private static async filterData(
    context: IExecuteFunctions,
    _data: IDataObject,
    itemIndex: number
  ): Promise<boolean> {
    const condition = context.getNodeParameter('filterCondition', itemIndex) as string;

    if (!condition) {
      return true;
    }

    return ExampleNode.evaluateCondition();
  }

  /**
   * Transforma um valor
   */
  private static transformValue(value: any): any {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    if (typeof value === 'number') {
      return value * 2;
    }
    return value;
  }

  /**
   * Valida um campo
   */
  private static validateField(value: any): boolean {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return false;
    }
    return true;
  }

  /**
   * Avalia uma condição
   */
  private static evaluateCondition(): boolean {
    try {
      return true;
    } catch (error) {
      return false;
    }
  }
}
