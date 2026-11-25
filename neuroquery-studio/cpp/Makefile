CXX := clang++
CXXFLAGS := -std=c++20 -O3 -Wall -Wextra -pedantic -Iinclude
TARGET_DIR := bin
TARGET := $(TARGET_DIR)/neuroquery_engine

SRCS := src/engine.cpp src/main.cpp
OBJS := $(SRCS:.cpp=.o)

.PHONY: all clean run benchmark test

all: $(TARGET)

$(TARGET_DIR):
	mkdir -p $(TARGET_DIR)

$(TARGET): $(OBJS) | $(TARGET_DIR)
	$(CXX) $(CXXFLAGS) -o $@ $^

%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

run: $(TARGET)
	./$(TARGET)

benchmark: $(TARGET)
	./$(TARGET) --benchmark

test: $(TARGET)
	./$(TARGET)

clean:
	rm -rf $(OBJS) $(TARGET_DIR)
