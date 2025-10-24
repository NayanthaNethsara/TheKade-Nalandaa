#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}         🔐 Authentication E2E Test Suite Runner 🔐              ${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Parse command line arguments
BROWSER=${1:-chromium}
TEST_FILE=${2:-"tests/auth*.spec.ts"}
HEADED=${3:-false}

echo -e "${YELLOW}Configuration:${NC}"
echo -e "  Browser: ${GREEN}$BROWSER${NC}"
echo -e "  Test Files: ${GREEN}$TEST_FILE${NC}"
echo -e "  Headed Mode: ${GREEN}$HEADED${NC}"
echo ""

# Change to frontend directory
cd "$(dirname "$0")/../frontend" || exit 1

# Run tests based on configuration
if [ "$HEADED" = "true" ] || [ "$HEADED" = "headed" ]; then
  echo -e "${BLUE}Running tests in headed mode...${NC}"
  npx playwright test "$TEST_FILE" \
    --project="$BROWSER" \
    --headed \
    --reporter=list,html
else
  echo -e "${BLUE}Running tests in headless mode...${NC}"
  npx playwright test "$TEST_FILE" \
    --project="$BROWSER" \
    --reporter=list,html,json,junit
fi

# Capture exit code
TEST_EXIT_CODE=$?

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"

# Display results based on exit code
if [ $TEST_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed successfully!${NC}"
else
  echo -e "${RED}❌ Some tests failed (Exit code: $TEST_EXIT_CODE)${NC}"
fi

echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Show report location
echo -e "${YELLOW}📊 Test Reports:${NC}"
echo -e "  HTML Report: ${GREEN}frontend/playwright-report/index.html${NC}"
echo -e "  JSON Results: ${GREEN}frontend/test-results/results.json${NC}"
echo -e "  JUnit XML: ${GREEN}frontend/results.xml${NC}"
echo ""

# Ask to open report
if [ $TEST_EXIT_CODE -ne 0 ]; then
  echo -e "${YELLOW}Would you like to open the test report? (y/n)${NC}"
  read -r OPEN_REPORT
  if [ "$OPEN_REPORT" = "y" ] || [ "$OPEN_REPORT" = "Y" ]; then
    npx playwright show-report
  fi
fi

exit $TEST_EXIT_CODE
