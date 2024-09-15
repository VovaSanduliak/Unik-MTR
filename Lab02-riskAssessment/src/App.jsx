import './App.css'
import {Button, NumberInput, Stack, Table, TextInput} from "@mantine/core";
import {useEffect, useState} from "react";

const App = () => {
  const [variants, setVariants] = useState(
    [
      {
        name: "Акції",
        success: {
          possibility: 0.6,
          profit: 500
        },
        fail: {
          possibility: 0.4,
          profit: 300
        }
      },
      {
        name: "Облігації",
        success: {
          possibility: 0.9,
          profit: 440
        },
        fail: {
          possibility: 0.1,
          profit: 120
        }
      },
    ]
  )

  const [expectationValues, setExpectationValues] = useState([]);
  const [dispersionValues, setDispersionValues] = useState([]);
  const [variationCoeffValues, setVariationCoeffValues] = useState([]);

  const handleVariantNameChange = (value, index) => {
    setVariants(prevState => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        success: {
          ...newState[index].success,
          possibility: parseFloat(value)
        }
      };
      return newState;
    });
  }

  const handleSuccessPossibilityChange = (value, index) => {
    setVariants(prevState => {
      const newState = [...prevState];
      newState[index].success.possibility = +value;

      return newState;
    });
  }

  const handleFailPossibilityChange = (value, index) => {
    setVariants(prevState => {
      const newState = [...prevState];
      newState[index].fail.possibility = +value;

      return newState;
    });
  }

  const handleSuccessProfitChange = (value, index) => {
    setVariants(prevState => {
      const newState = [...prevState];
      newState[index].success.profit = +value;

      return newState;
    });
  }

  const handleFailProfitChange = (value, index) => {
    setVariants(prevState => {
      const newState = [...prevState];
      newState[index].fail.profit = +value;

      return newState;
    });
  }

  const addNewVariant = (value, index) => {
    setVariants(prevState => {
      const newState = [...prevState];
      newState.push({
        name: "new",
        success: {
          possibility: 0.5,
          profit: 100
        },
        fail: {
          possibility: 0.5,
          profit: 100
        }
      });

      return newState;
    });
  }

  const deleteVariant = (rowNumber) => {
    setVariants(prevState => {
      return prevState.filter((_, i) => i !== rowNumber);
    })
  }

  useEffect(() => {
    const calculatedExpectations = variants.map((variant) => {
      return variant.success.possibility * variant.success.profit + variant.fail.possibility * variant.fail.profit;
    });

    setExpectationValues(calculatedExpectations);
  }, [variants]);

  useEffect(() => {
    const calculatedDispersions = variants.map((variant, variantNumber) => {
      return variant.success.possibility * Math.pow(variant.success.profit - expectationValues[variantNumber], 2) + variant.fail.possibility * Math.pow(variant.fail.profit - expectationValues[variantNumber], 2)
    })

    setDispersionValues(calculatedDispersions);
  }, [expectationValues]);

  useEffect(() => {
    const calculatedVariationCoefficients = variants.map((_, variantNumber) => {
      return (Math.sqrt(dispersionValues[variantNumber]) / expectationValues[variantNumber]).toFixed(3);
    })

    setVariationCoeffValues(calculatedVariationCoefficients)
  }, [dispersionValues])

  return (
    <Stack h={100} p={50}>
      <Stack>
        <Table highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th rowSpan={2}>Варіант</Table.Th>
              <Table.Th colSpan={2}>Успіх</Table.Th>
              <Table.Th colSpan={2}>Невдача</Table.Th>
              <Table.Th rowSpan={2}>Математичне сподівання (M)</Table.Th>
              <Table.Th rowSpan={2}>Варіація (D)</Table.Th>
              <Table.Th rowSpan={2}>Коеф варіації (σ)</Table.Th>
              <Table.Th rowSpan={2}></Table.Th>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>ймовірність</Table.Th>
              <Table.Th>прибуток</Table.Th>
              <Table.Th>ймовірність</Table.Th>
              <Table.Th>прибуток</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {variants.map((variant, rowNumber) => {
              return (
                <Table.Tr key={variant.name}>
                  <Table.Td>
                    <TextInput
                      onChange={(event) => handleVariantNameChange(event.target.value, rowNumber)}
                      variant={"filled"}
                      value={variant.name}
                    />

                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      onChange={(value) => handleSuccessPossibilityChange(value, rowNumber)}
                      value={variant.success.possibility}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      onChange={(value) => handleSuccessProfitChange(value, rowNumber)}
                      value={variant.success.profit}
                      step={50}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      onChange={(value) => handleFailPossibilityChange(value, rowNumber)}
                      value={variant.fail.possibility}
                      min={0}
                      max={1}
                      step={0.1}
                    />
                  </Table.Td>
                  <Table.Td>
                    <NumberInput
                      onChange={(value) => handleFailProfitChange(value, rowNumber)}
                      value={variant.fail.profit}
                      step={50}
                    />
                  </Table.Td>

                  <Table.Td>{expectationValues[rowNumber]}</Table.Td>
                  <Table.Td>{dispersionValues[rowNumber]}</Table.Td>
                  <Table.Td>{variationCoeffValues[rowNumber]}</Table.Td>
                  <Table.Td>
                    <Button
                      onClick={() => deleteVariant(rowNumber)}>
                      X
                    </Button>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
        <Button
          onClick={addNewVariant}
          variant={"outline"}
          mt={10}>+</Button>
      </Stack>

      {/*<Group justify="space-between" style={{margin: "10px 0 0 0"}}>*/}
      {/*  <div>*/}
      {/*    <Table highlightOnHover withTableBorder withColumnBorders>*/}
      {/*      <Table.Thead>*/}
      {/*        <Table.Tr>*/}
      {/*          <Table.Th>Варіант</Table.Th>*/}
      {/*          <Table.Th colSpan={2}>Математичне сподівання</Table.Th>*/}
      {/*        </Table.Tr>*/}
      {/*      </Table.Thead>*/}
      {/*      <Table.Tbody>*/}
      {/*        {variants.map((variant, variantNumber) => {*/}
      {/*          return (*/}
      {/*            <Table.Tr key={variant.name}>*/}
      {/*              <Table.Td>{variant.name}</Table.Td>*/}
      {/*              <Table.Td>{`${variant.success.possibility} * ${variant.success.profit} + ${variant.fail.possibility} * ${variant.fail.profit}`}</Table.Td>*/}
      {/*              <Table.Td>{expectationValues[variantNumber]}</Table.Td>*/}
      {/*            </Table.Tr>*/}
      {/*          )*/}
      {/*        })}*/}
      {/*      </Table.Tbody>*/}
      {/*    </Table>*/}
      {/*  </div>*/}

      {/*  <div>*/}
      {/*    <Table highlightOnHover withTableBorder withColumnBorders>*/}
      {/*      <Table.Thead>*/}
      {/*        <Table.Tr>*/}
      {/*          <Table.Th>Варіант</Table.Th>*/}
      {/*          <Table.Th colSpan={2}>Варіація</Table.Th>*/}
      {/*        </Table.Tr>*/}
      {/*      </Table.Thead>*/}
      {/*      <Table.Tbody>*/}
      {/*        {variants.map((variant, variantNumber) => {*/}
      {/*          return (*/}
      {/*            <Table.Tr key={variant.name}>*/}
      {/*              <Table.Td>{variant.name}</Table.Td>*/}
      {/*              <Table.Td>{`${variant.success.possibility} * ${Math.pow(variant.success.profit - expectationValues[variantNumber], 2)} + ${variant.fail.possibility} * ${Math.pow(variant.fail.profit - expectationValues[variantNumber], 2)}`}</Table.Td>*/}
      {/*              <Table.Td>{dispersionValues[variantNumber]}</Table.Td>*/}
      {/*            </Table.Tr>*/}
      {/*          )*/}
      {/*        })}*/}
      {/*      </Table.Tbody>*/}
      {/*    </Table>*/}
      {/*  </div>*/}

      {/*  <div>*/}
      {/*    <Table highlightOnHover withTableBorder withColumnBorders>*/}
      {/*      <Table.Thead>*/}
      {/*        <Table.Tr>*/}
      {/*          <Table.Th>Варіант</Table.Th>*/}
      {/*          <Table.Th colSpan={2}>Коефіцієнт варіації</Table.Th>*/}
      {/*        </Table.Tr>*/}
      {/*      </Table.Thead>*/}
      {/*      <Table.Tbody>*/}
      {/*        {variants.map((variant, variantNumber) => {*/}
      {/*          return (*/}
      {/*            <Table.Tr key={variant.name}>*/}
      {/*              <Table.Td>{variant.name}</Table.Td>*/}
      {/*              <Table.Td>{dispersionValues[variantNumber]} / {expectationValues[variantNumber]}</Table.Td>*/}
      {/*              <Table.Td>{variationCoeffValues[variantNumber]}</Table.Td>*/}
      {/*            </Table.Tr>*/}
      {/*          )*/}
      {/*        })}*/}
      {/*      </Table.Tbody>*/}
      {/*    </Table>*/}
      {/*  </div>*/}
      {/*</Group>*/}
    </Stack>

  )
}

export default App;
