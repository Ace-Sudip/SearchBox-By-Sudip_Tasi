import {
  Box,
  Flex,
  Input,
  Kbd,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Text,
  Select,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  AiOutlineArrowDown,
  AiOutlineArrowUp,
  AiOutlineCloseSquare,
  AiOutlineEnter
} from "react-icons/ai";
import { LuLayoutList } from "react-icons/lu";
import Mousetrap from "mousetrap";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const handleCloseModal = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setResults(response.data);
      } catch (error) {
        console.log("Error fetching search results:", error);
      }
    };

    fetchData();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" || (event.ctrlKey && event.key === "k")) {
      event.preventDefault();
      setShowPopup(true);
    }
  };

  useEffect(() => {
    Mousetrap.bind("ctrl+k", handleKeyPress);
    return () => {
      Mousetrap.unbind("ctrl+k", handleKeyPress);
    };
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const handlePriceChange = (event) => {
    setSelectedPrice(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setQuery(event.target.value);
  };
  const filteredResults = results.filter((result) => {
    if (selectedCategory !== "" && result.category !== selectedCategory) {
      return false;
    }

    if (selectedPrice !== "") {
      const price = parseInt(selectedPrice);
      if (price === 20 && result.price >= 20) {
        return false;
      }
      if (price === 50 && (result.price < 20 || result.price >= 50)) {
        return false;
      }
      if (price === 100 && (result.price < 50 || result.price >= 100)) {
        return false;
      }
      if (price === 1000 && (result.price < 100 || result.price >= 1000)) {
        return false;
      }
    }

    if (
      query !== "" &&
      !result.title.toLowerCase().includes(query.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  return (
    <Flex
      align="center"
      justify="center"
      minHeight="100vh"
      p={{ base: 4, md: 8, lg: 16 }}
    >
      <InputGroup maxWidth={{ base: "100%", md: "200px" }}>
        <InputLeftElement pointerEvents="none">
          <FaSearch />
        </InputLeftElement>
        <InputRightElement pointerEvents="none" mr="20px">
          <Kbd>Ctrl K</Kbd>
        </InputRightElement>
        <Input
          borderRadius={5}
          backgroundColor="#EDf2F7"
          placeholder="Search"
          size="md"
          onClick={() => {
            setShowPopup(true);
          }}
          onKeyDown={handleKeyPress}
        />
      </InputGroup>

      <Modal isOpen={showPopup} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Flex
              direction={{ base: "column", md: "row" }}
              justify={{ base: "center", md: "space-between" }}
              mb={4}
            >
              <InputGroup
                maxWidth={{ base: "100%", md: "400px" }}
                mb={{ base: 4, md: 0 }}
              >
                <InputLeftElement children={<FaSearch />} />
                <InputRightElement mr={1}>
                  <LuLayoutList fontSize="20px" />
                  &nbsp;&nbsp;
                  <AiOutlineCloseSquare
                    fontSize="20px"
                    onClick={handleCloseModal}
                  />
                </InputRightElement>
                <Input
                  placeholder="Search"
                  size="sm"
                  onChange={handleSearchInputChange}
                  mt={1}
                  fontSize="18px"
                />
              </InputGroup>
              <br />
              <Box ml="auto">
                <Select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  ml={2}
                  mb={1}
                  width="120px"
                >
                  <option value="">Category</option>
                  <option value="men's clothing">Men's clothing</option>
                  <option value="jewelery">Jewelery</option>
                  <option value="electronics">Electronics</option>
                  <option value="women's clothing">Women's clothing</option>
                </Select>
              </Box>
              <Box ml="auto">
                <Select
                  value={selectedPrice}
                  onChange={handlePriceChange}
                  ml={3}
                  mb={1}
                  width="120px"
                >
                  <option value="">Price</option>
                  <option value="20">less than $20</option>
                  <option value="50">less than $50</option>
                  <option value="100">less than $100</option>
                  <option value="1000">less than $1000</option>
                </Select>
              </Box>
            </Flex>

            <Flex align="center" justify="flex-start">
              <Kbd>
                <AiOutlineArrowUp />
              </Kbd>{" "}
              &nbsp;
              <Kbd>
                <AiOutlineArrowDown />
              </Kbd>
              &nbsp;to navigate &nbsp;
              <Kbd>
                <AiOutlineEnter />
              </Kbd>
              &nbsp;to select &nbsp;
              <Kbd>esc</Kbd>&nbsp;to close
            </Flex>

            {filteredResults.length === 0 ? (
              <Text>No results found.</Text>
            ) : (
              <Box mt={3}>
                {filteredResults.map((result) => (
                  <Box
                    p={2}
                    key={result.id}
                    mb={4}
                    minH={16}
                    mt={2}
                    borderRadius="lg"
                    border="1px solid black"
                    display="flex"
                  >
                    <Text as="strong">{result.title}</Text>
                    <Text as="span" ml="2">
                      {result.category}
                    </Text>
                    <Text as="span" ml="2">
                      {result.price}
                    </Text>
                  </Box>
                ))}
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

export default App;
