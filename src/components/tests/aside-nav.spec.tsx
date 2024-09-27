import "@testing-library/jest-dom"
import { fireEvent, render, screen } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter } from "react-router-dom"
import { AsideNav } from "../aside-nav"

const mockNavigate = jest.fn();
jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useNavigate: () => mockNavigate
}))

const renderComponent = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AsideNav />
            </BrowserRouter>
        </QueryClientProvider>
    )
    return queryClient;
}


describe('AsideNav', () => {	
    it('should render correctly', () => {
        // AAA => Arrange, Act, Assert
        // Arrange
        renderComponent();

        // Assert
        expect(screen.getByText("All files")).toBeInTheDocument(); // Check if the text is in the document
        expect(screen.getByText("Favorites")).toBeInTheDocument(); // Check if the text is in the document
    })

    it("Should call navigate when hits the button Allfiles", () => {
        // Arrange
        renderComponent();
        const btnAllFiles = screen.getByText("All files"); // Get the button by text

        // Act
        fireEvent.click(btnAllFiles); // Click the AllFiles button

        // Assert
        expect(mockNavigate).toHaveBeenCalledWith("/"); // Check if the navigate function was called with the correct path
    })

    it("Should call navigate when hits the button Favorites", () => {
        renderComponent();
        const btnFavorites = screen.getByText("Favorites"); // Get the button by text
        fireEvent.click(btnFavorites); // Click the AllFiles button

        expect(mockNavigate).toHaveBeenCalledWith("/favorites"); // Check if the navigate function was called with the correct path
    })

})